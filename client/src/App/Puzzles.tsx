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
        steps: 1000,
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
        steps: 1000,
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

]