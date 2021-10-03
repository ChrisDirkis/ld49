import { IOrganismTemplate, IPuzzle, simulate } from "./simulate";

function generateRandomCreature(): IOrganismTemplate {
    return {
        name: "random",

        weapons: Math.floor(Math.random() * 5),
        armour: Math.floor(Math.random() * 5),
        speed: Math.floor(Math.random() * 5),

        eatsGrass: Math.random() > 0.5,
        eatsLeaves: Math.random() > 0.5,
        eatsSeeds: Math.random() > 0.5,
    }
}

function generateRandomPuzzle(): IPuzzle {
    const creatureCount = 3 + Math.floor(Math.random() * 3);

    const creatures = [...new Array(creatureCount)].map(_ => generateRandomCreature());
    return {
        seedsPerRound: 200,
        leavesPerRound: 200,
        grassPerRound: 200,

        initialEnergyPerSpecies: 200,

        steps: 400,

        organismTemplates: creatures,
        playerOrganismCount: 1,
    }
}

function creatureNeighbours(creature: IOrganismTemplate): IOrganismTemplate[] {
    const neighbours: IOrganismTemplate[] = []

    neighbours.push({...creature, weapons: creature.weapons + 1})
    if (creature.weapons > 0) {
        neighbours.push({...creature, weapons: creature.weapons - 1})
    }
    neighbours.push({...creature, armour: creature.armour + 1})
    if (creature.armour > 0) {
        neighbours.push({...creature, armour: creature.armour - 1})
    }
    neighbours.push({...creature, speed: creature.speed + 1})
    if (creature.speed > 0) {
        neighbours.push({...creature, speed: creature.speed - 1})
    }

    neighbours.push({...creature, eatsSeeds: !creature.eatsSeeds});
    neighbours.push({...creature, eatsLeaves: !creature.eatsLeaves});
    neighbours.push({...creature, eatsGrass: !creature.eatsGrass});
    

    return neighbours;
}

let attempt = 0;
while (true) {
    attempt++;
    console.log(`trying puzzle ${attempt}`);

    const puzzle = generateRandomPuzzle();
    for (let i = 0; i < 10; i++) {
        const playerCreature = generateRandomCreature();
        if (simulate(puzzle, [playerCreature], Math.PI).resultSummary === "success") {
            console.log("player passed, checking neighbours");
            const neighbours = creatureNeighbours(playerCreature);
            let passes = 4;
            for (const neighbour of neighbours) {
                if (simulate(puzzle, [neighbour], Math.PI).resultSummary === "success") {
                    passes--;
                    if (passes === 0) {
                        break;
                    }
                }
            }

            if (passes > 0) {
                console.log(puzzle);
                console.log(playerCreature);
            }
        }
    }
}