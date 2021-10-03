import { FC, useMemo } from "react";
import { Legend, Line, LineChart, ResponsiveContainer } from "recharts";

import Styles from './PuzzleResults.module.scss';
import { IOrganismTemplate, IPuzzle, simulate } from "./Simulator";

interface IPuzzleResultsProps {
    puzzle: IPuzzle;
    playerOrganisms: IOrganismTemplate[];
    seed: number;
    reseed: () => void;
    onLevelPassed: () => void
}

const colors = [
    "#74569B",
    "#96FBC7",
    "#F7FFAE",
    "#FFB3CB",
    "#fffef7",
]

const Creature: FC<IPuzzleResultsProps> = ({puzzle, playerOrganisms, seed, reseed, onLevelPassed}) => {

    const results = useMemo(() => {
        return simulate(puzzle, playerOrganisms, seed);
    }, [puzzle, playerOrganisms, seed]);

    if (results.resultSummary === "success") {
        onLevelPassed();
    }
    
    const legendFormatter = (value: string, entry: any, index: number) => {
        const organism = index < puzzle.organismTemplates.length 
            ? puzzle.organismTemplates[index]
            : playerOrganisms[index - puzzle.organismTemplates.length];
            
        return <span style={{color: entry}}>{organism.name}</span>
    }



    const isValid = puzzle.playerOrganismsPassConstraints(playerOrganisms);
    const passFailClassname = results.resultSummary === "success" && isValid ? Styles["success"] : Styles["fail"];
    
    return <div className={Styles["results"] + " " + passFailClassname} >
        {!isValid && <h2 className={Styles["title"]}>invalid ecosystem</h2>}
        {isValid && <>
            <h2 className={Styles["title"]}>{results.resultSummary}</h2>
            <div className={Styles["graph"]}>
                <ResponsiveContainer>
                <LineChart data={results.roundResults}>
                    <Legend verticalAlign="bottom" height={36} formatter={legendFormatter} margin={{top: 36}}/>
                    {
                        [...results.roundResults[0].keys()].map(i => 
                            <Line 
                                key={i}
                                type="monotone"
                                stroke={colors[i % colors.length]}
                                dataKey={i}
                                dot={false}
                                strokeWidth={5}
                                
                            />
                        )
                    }
                </LineChart>
                </ResponsiveContainer>
            </div>
            {results.resultSummary === "fail" && <button onClick={reseed}>try another reality</button>}
        </>}
    </div>
}

export default Creature;