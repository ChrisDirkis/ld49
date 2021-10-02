export interface IPuzzle {
    description: JSX.Element;

    organismTemplates: IOrganismTemplate[];
    steps: number;
    initialEnergyPerSpecies: number;

    seedsPerRound: number;
    leavesPerRound: number;
    grassPerRound: number;

    playerOrganismCount: number;
    playerOrganismsPassConstraints: (organisms: IOrganismTemplate[]) => boolean;
    defaultPlayerOrganisms: IOrganismTemplate[];
}

export interface IOrganismTemplate {
    name?: string;
    image?: any;

    weapons: number;
    armour: number;
    speed: number;

    eatsSeeds: boolean;
    eatsGrass: boolean;
    eatsLeaves: boolean;
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
    let organisms: number[] = [];
    
    for (const organismTemplate of puzzle.organismTemplates) {
        const index = organismTemplates.length;
        const energy = getEnergyCost(organismTemplate);
        const organismCount = Math.floor(puzzle.initialEnergyPerSpecies / energy)
        for (let i = 0; i < organismCount; i++) {
            organisms.push(index);
        }
        organismTemplates.push(organismTemplate);
    }
    for (const organismTemplate of playerOrganisms) {
        const index = organismTemplates.length;
        const energy = getEnergyCost(organismTemplate);
        const organismCount = Math.floor(puzzle.initialEnergyPerSpecies / energy)
        for (let i = 0; i < organismCount; i++) {
            organisms.push(index);
        }
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
        resources.seeds = puzzle.seedsPerRound;
        resources.leaves = puzzle.leavesPerRound;
        resources.grass = puzzle.grassPerRound;

        const newOrganisms: number[] = [];
        shuffle(organisms, rng);
        const length = organisms.length;
        for (let i = 0; i < length - 1; i += 2) {
            let aIndex = i;
            let bIndex = i + 1;

            const aOrganism = organisms[aIndex];
            const bOrganism = organisms[bIndex];

            const aOrganismTemplate = organismTemplates[aOrganism];
            const bOrganismTemplate = organismTemplates[bOrganism];
            
            for (const child of interact(aOrganism, aOrganismTemplate, bOrganism, bOrganismTemplate, resources, rng)) {
                newOrganisms.push(child);
            }
        }

        const roundResults = organismTemplates.map(_ => 0);
        for (const organism of newOrganisms) {
            roundResults[organism]++;
        }
        allRoundResults.push(roundResults);
        if (roundResults.some(r => r === 0)) {
            break;
        }

        organisms = newOrganisms;
    }

    const lastRoundResult = allRoundResults[allRoundResults.length - 1];
    

    return { roundResults: allRoundResults, resultSummary: lastRoundResult.some(r => r === 0) ? "fail" : "success" };
}


function interact(aOrganism: number, aOrganismTemplate: IOrganismTemplate, bOrganism: number, bOrganismTemplate: IOrganismTemplate, resources: IResources, rng: () => number): number[] {
    const fightWinnerTemplate = getFightWinner(aOrganism, aOrganismTemplate, bOrganism, bOrganismTemplate);
    if (fightWinnerTemplate) {
        const fightLoserTemplate =  fightWinnerTemplate === aOrganismTemplate ? bOrganismTemplate : aOrganismTemplate;
        const fightWinner = fightWinnerTemplate === aOrganismTemplate ? aOrganism : bOrganism;
        const predationEnergy = 0.95 * getEnergyCost(fightLoserTemplate);
        return reproduce(fightWinner, fightWinnerTemplate, predationEnergy, rng);
    }
    else {
        // Forage
        const newOrganisms = []
        for (const organism of reproduce(aOrganism, aOrganismTemplate, tryForage(aOrganismTemplate, resources), rng)) {
            newOrganisms.push(organism);
        }
        for (const organism of reproduce(bOrganism, bOrganismTemplate, tryForage(bOrganismTemplate, resources), rng)) {
            newOrganisms.push(organism);
        }
        return newOrganisms;
    }
}

function getFightWinner(aOrganism: number, aOrganismTemplate: IOrganismTemplate, bOrganism: number, bOrganismTemplate: IOrganismTemplate): IOrganismTemplate | null {
    if (aOrganism === bOrganism) return null;
    if (aOrganismTemplate.weapons > bOrganismTemplate.weapons + bOrganismTemplate.armour) return aOrganismTemplate;
    if (bOrganismTemplate.weapons > aOrganismTemplate.weapons + aOrganismTemplate.armour) return bOrganismTemplate;
    if (aOrganismTemplate.speed > bOrganismTemplate.speed) return aOrganismTemplate;
    if (bOrganismTemplate.speed > aOrganismTemplate.speed) return bOrganismTemplate;
    return null;
}

const reproductionConstant = 3;
function reproduce(organism: number, template: IOrganismTemplate, bonusEnergy: number, rng: () => number): number[] {
    const children = []

    const templateEnergy = getEnergyCost(template)
    const energy = templateEnergy * 0.8 + bonusEnergy;
    const reproductionOpportunities = Math.floor(reproductionConstant * energy);

    for (let opportunity = 0; opportunity < reproductionOpportunities; opportunity++) {
        if (rng() < 1 / templateEnergy / reproductionConstant) {
            children.push(organism)
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

export function defaultOrganismTemplate(): IOrganismTemplate {
    return {
        weapons: 0,
        armour: 0,
        speed: 0,

        eatsGrass: false,
        eatsLeaves: false,
        eatsSeeds: false,
    }
}

function shuffle<T>(array: T[], rng: () => number) {
    const length = array.length;
    let temp: T;
    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(rng() * i);
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}