export interface IPuzzle {
    organismTemplates: IOrganismTemplate[];
    steps: number;
    initialEnergyPerSpecies: number;

    seedsPerRound: number;
    leavesPerRound: number;
    grassPerRound: number;

    playerOrganismCount: number;

}

export interface IOrganismTemplate {
    name?: string;
    image?: any;

    weapons: number;
    armour: number;
    speed: number;

    noWeaponsInput?: boolean;
    noArmourInput?: boolean;
    noSpeedInput?: boolean;

    eatsSeeds: boolean;
    eatsGrass: boolean;
    eatsLeaves: boolean;

    noSeedsInput?: boolean;
    noGrassInput?: boolean;
    noLeavesInput?: boolean;
}

export interface IResources {
    seeds: number;
    leaves: number;
    grass: number;
}

export interface IResult {
    roundResults: number[][];
    resultSummary: "success" | "fail";
}

export function simulate(puzzle: IPuzzle, playerOrganisms: IOrganismTemplate[], seed: number): IResult  {
    var rng = mulberry32(seed);

    // Initial organisms and templates
    const organismTemplates: IOrganismTemplate[] = []
    let organisms: number[] = new Array(puzzle.organismTemplates.length + playerOrganisms.length).fill(0);
    let totalOrganisms = 0;
    for (const organismTemplate of puzzle.organismTemplates) {
        const index = organismTemplates.length;
        const energy = getEnergyCost(organismTemplate);
        const organismCount = Math.floor(puzzle.initialEnergyPerSpecies / energy)
        organisms[index] = organismCount;
        totalOrganisms += organismCount;
        organismTemplates.push(organismTemplate);
    }
    for (const organismTemplate of playerOrganisms) {
        const index = organismTemplates.length;
        const energy = getEnergyCost(organismTemplate);
        const organismCount = Math.floor(puzzle.initialEnergyPerSpecies / energy)
        organisms[index] = organismCount;
        totalOrganisms += organismCount;
        organismTemplates.push(organismTemplate);
    }

    const resources: IResources = {
        seeds: 0,
        leaves: 0,
        grass: 0,
    }

    // Simulate
    const allRoundResults = [];
    for (let step = 0; step < puzzle.steps; step++) {
        resources.seeds =+ puzzle.seedsPerRound;
        resources.leaves =+ puzzle.leavesPerRound;
        resources.grass =+ puzzle.grassPerRound;

        let newOrganisms: number[] = new Array(organismTemplates.length).fill(0);
        let newTotal = 0;
        
        const samples = Math.floor(totalOrganisms / 2);
        for (let i = 0; i < samples; i ++) {
            let aIndex = sample(organisms, totalOrganisms, organismTemplates.length, rng);
            totalOrganisms--;
            let bIndex = sample(organisms, totalOrganisms, organismTemplates.length, rng);
            totalOrganisms--;

            const aOrganismTemplate = organismTemplates[aIndex];
            const bOrganismTemplate = organismTemplates[bIndex];
            
            const children = interact(aIndex, aOrganismTemplate, bIndex, bOrganismTemplate, resources, rng);
            for (const [key, value] of children) {
                newOrganisms[key] += value;
                newTotal += value;
            }
        }

        const roundResults = organismTemplates.map(_ => 0);
        for (let i = 0; i < organismTemplates.length; i ++) {
            roundResults[i] += newOrganisms[i];
        }
        allRoundResults.push(roundResults);
        if (roundResults.some(r => r === 0)) {
            break;
        }

        organisms = newOrganisms;
        totalOrganisms = newTotal;
    }

    const lastRoundResult = allRoundResults[allRoundResults.length - 1];
    

    return { roundResults: allRoundResults, resultSummary: lastRoundResult.some(r => r === 0) ? "fail" : "success" };
}

function sample(organisms: {[key: number]: number}, totalOrganisms: number, totalCategories: number, rng: () => number): number {
    let roll = Math.floor(rng() * totalOrganisms);
    let sum = 0;
    let key = 0;
    while (key < totalCategories) {
        sum += organisms[key];
        if (sum > roll) {
            organisms[key]--;
            return key;
        }
        key++;
    }
    console.error("Sample failure");
    return 0;
}

const predationEfficiency = 0.95;
function interact(aOrganism: number, aOrganismTemplate: IOrganismTemplate, bOrganism: number, bOrganismTemplate: IOrganismTemplate, resources: IResources, rng: () => number): number[][] {
    const fightWinnerTemplate = getFightWinner(aOrganism, aOrganismTemplate, bOrganism, bOrganismTemplate);
    if (fightWinnerTemplate) {
        const fightLoserTemplate =  fightWinnerTemplate === aOrganismTemplate ? bOrganismTemplate : aOrganismTemplate;
        const fightWinner = fightWinnerTemplate === aOrganismTemplate ? aOrganism : bOrganism;
        const predationEnergy = predationEfficiency * getEnergyCost(fightLoserTemplate);
        return [[fightWinner, reproduce(fightWinnerTemplate, predationEnergy, rng)]];
    }
    else {
        // Forage
        return [
            [aOrganism, reproduce(aOrganismTemplate, tryForage(aOrganismTemplate, resources), rng)],
            [bOrganism, reproduce(bOrganismTemplate, tryForage(bOrganismTemplate, resources), rng)],
        ];
    }
}

function getFightWinner(aOrganism: number, aOrganismTemplate: IOrganismTemplate, bOrganism: number, bOrganismTemplate: IOrganismTemplate): IOrganismTemplate | null {
    if (aOrganism === bOrganism) return null;
    if (aOrganismTemplate.weapons > bOrganismTemplate.weapons + bOrganismTemplate.armour && aOrganismTemplate.speed > bOrganismTemplate.speed) return aOrganismTemplate;
    if (bOrganismTemplate.weapons > aOrganismTemplate.weapons + aOrganismTemplate.armour && bOrganismTemplate.speed > aOrganismTemplate.speed) return bOrganismTemplate;
    return null;
}

const reproductionConstant = 5;
function reproduce(template: IOrganismTemplate, bonusEnergy: number, rng: () => number): number {
    let children = 0

    const templateEnergy = getEnergyCost(template)
    const energy = templateEnergy * 0.8 + bonusEnergy;
    const reproductionOpportunities = Math.floor(reproductionConstant * energy);

    for (let opportunity = 0; opportunity < reproductionOpportunities; opportunity++) {
        if (rng() < 1 / templateEnergy / reproductionConstant) {
            children++;
        }
    }

    return children;
}

function tryForage(template: IOrganismTemplate, resources: IResources): number {
    if (template.eatsLeaves && resources.leaves > 0) {
        resources.leaves--;
        return 7;
    } 
    else if (template.eatsGrass && resources.grass > 0) {
        resources.grass--;
        return 6;
    } 
    else if (template.eatsSeeds && resources.seeds > 0) {
        resources.seeds--;
        return 5;
    } 
    return 0;
}

export function getEnergyCost(template: IOrganismTemplate): number {
    let cost = 0.1;     // base cost
    if (template.eatsGrass) cost += 5;
    if (template.eatsLeaves) cost += 3;
    if (template.eatsSeeds) cost += 1;

    cost += template.weapons;
    cost += template.armour * 0.75;
    cost += template.speed;

    return cost;
}

function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}