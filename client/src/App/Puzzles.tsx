import { IOrganismTemplate, IPuzzle } from "./Simulator";

import CatIcon from "../Images/cat.png"

import MouseIcon from '../Images/mouse.png';

export const Puzzles: IPuzzle[] = [
    {
        description: <>
            <p>Me, a cadet, in charge of equilibrizing these worlds? I don't... I don't know, it seems like such a big responsibility.</p>
            <p>But I have to succeed. I must!</p>
            <br/>
            <p>This world has nothing but plants, all around. There should be enough resources to support <em>an animal that only eats plants,</em> I reckon. Easy peasy!</p>
        </>,

        organismTemplates: [],
        steps: 200,
        initialEnergyPerSpecies: 200,

        seedsPerRound: 200,
        leavesPerRound: 200,
        grassPerRound: 200,

        playerOrganismCount: 1,
        playerOrganismsPassConstraints: (_) => true,
        defaultPlayerOrganisms: [
            {
                name: "grazing cat",
                image: CatIcon,

                weapons: 0,
                armour: 0,
                speed: 0,

                noWeaponsInput: true,
                noArmourInput: true,
                noSpeedInput: true,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            }
        ],
    },
    {
        description: <>
            <p>Yes! I've equilibrized my first world, I'm on fire! Well, figuratively, not literally, except for in the way that everything's oxidising slowly all the time anyway. Ooh, Command's giving me a new operation.</p>
            <p>Hang on... this world is already populated?</p>
            <br/>
            <p>This world has a large population of mice, and I've been instructed to introduce predator cats. What did they say in academy... that's right! <em>For an animal to eat another, its weapons must be stronger than the other animal's weapons and armour, and it must be faster.</em> Luckily for me, these mice have no weapons or armour to speak of at all.</p>
            <p>One more thing: The higher the energy requirement, the harder it is for an animal to breed. <em>If one species is outcompeting another, try make it more expenisve without making it better (hunting is pass/fail).</em></p>
        </>,

        organismTemplates: [
            {
                name: "mouse",
                image: MouseIcon,
                
                weapons: 0,
                armour: 0,
                speed: 1,

                eatsSeeds: true,
                eatsLeaves: false,
                eatsGrass: false,
            }
        ],
        steps: 200,
        initialEnergyPerSpecies: 200,

        seedsPerRound: 200,
        leavesPerRound: 200,
        grassPerRound: 200,

        playerOrganismCount: 1,
        playerOrganismsPassConstraints: (organisms: IOrganismTemplate[]) => organisms[0].weapons > 0,
        defaultPlayerOrganisms: [
            {
                name: "predator cat",
                image: CatIcon,

                weapons: 0,
                armour: 0,
                speed: 0,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            }
        ],
    },
    {
        description: <>
            <p>Two species? You've got to be kidding me. Command must have it out for me. I can do it, though!</p>
            <br/>
            <p>This world has both mice and songbirds, but the songbirds aren't going to last long. They're so fast, but being fast doesn't give them any advantages when there's no predators.</p>
        </>,

        organismTemplates: [
            {
                name: "mouse",
                image: MouseIcon,
                
                weapons: 0,
                armour: 0,
                speed: 1,

                eatsSeeds: true,
                eatsLeaves: false,
                eatsGrass: false,
            },
            {
                name: "songbird",
                image: MouseIcon,
                
                weapons: 0,
                armour: 0,
                speed: 3,

                eatsSeeds: true,
                eatsLeaves: false,
                eatsGrass: false,
            },
        ],
        steps: 400,
        initialEnergyPerSpecies: 200,

        seedsPerRound: 200,
        leavesPerRound: 200,
        grassPerRound: 200,

        playerOrganismCount: 1,
        playerOrganismsPassConstraints: (organisms: IOrganismTemplate[]) => organisms[0].weapons > 0,
        defaultPlayerOrganisms: [
            {
                name: "predator cat",
                image: CatIcon,

                weapons: 0,
                armour: 0,
                speed: 0,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            }
        ],
    },
    
    {
        description: <>
            <p>Damn, I'm getting good at this! I'm proud of me right now, gotta say. What have we got in store this time?</p>
            <p>Aww, prey cats? I hate to see the poor things eaten, but it's for the good of the world, I guess.</p>
            <br/>
            <p>In this world, we have mice, songbirds, and falcons. We're going to have to figure out a way to balance out this mess.</p>
        </>,

        organismTemplates: [
            {
                name: "mouse",
                image: MouseIcon,
                
                weapons: 0,
                armour: 0,
                speed: 1,

                eatsSeeds: true,
                eatsLeaves: false,
                eatsGrass: false,
            },
            {
                name: "songbird",
                image: MouseIcon,
                
                weapons: 0,
                armour: 0,
                speed: 3,

                eatsSeeds: true,
                eatsLeaves: false,
                eatsGrass: false,
            },
            {
                name: "falcon",
                image: MouseIcon,
                
                weapons: 1,
                armour: 0,
                speed: 10,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            },
        ],
        steps: 400,
        initialEnergyPerSpecies: 200,

        seedsPerRound: 200,
        leavesPerRound: 200,
        grassPerRound: 200,

        playerOrganismCount: 2,
        playerOrganismsPassConstraints: (organisms: IOrganismTemplate[]) => organisms[0].weapons > 0 && organisms[1].weapons === 0,
        defaultPlayerOrganisms: [
            {
                name: "predator cat",
                image: CatIcon,

                weapons: 1,
                armour: 0,
                speed: 0,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            }, 
            
            {
                name: "prey cat",
                image: CatIcon,

                weapons: 0,
                armour: 0,
                speed: 0,

                eatsSeeds: false,
                eatsLeaves: false,
                eatsGrass: false,
            }
        ],
    },

]