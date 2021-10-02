rst pi

export interface IPuzzle {
    organisms: {template: IOrganismTemplate, count: number}[];
    playerOrganismCount: number;
    steps: number;
}

export interface IOrganismTemplate {
    weapons: number;
    armour: number;
    speed: number;

    eatsSeeds: number;
    eatsGrass: number;
    eatsLeaves: number;
}

export interface IOrganism {
    index: number;
}

export interface IResult {
    roundResults: {index: number, count: number}[];
    resultSummary: "success" | "fail";
}

function simulate(puzzle: IPuzzle, playerOrganism: IOrganismTemplate, seed: number): IResult  {
    var rng = mulberry32(seed);

    // Initial organisms and templates
    const organismTemplates: IOrganismTemplate[] = []
    let organisms: IOrganism[] = [];
    
    for (const organism of puzzle.organisms) {
        const index = organismTemplates.length;
        for (let i = 0; i < organism.count; i++) {
            organisms.push({ index });
        }
        organismTemplates.push(organism.template);
    }
    const playerOrganismIndex = organismTemplates.length;
    for (let i = 0; i < puzzle.playerOrganismCount; i++) {
        organisms.push({ index: playerOrganismIndex });
    }
    organismTemplates.push(playerOrganism);

    // Simulate




    return { roundResults: [], resultSummary: "success"};
}

function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}