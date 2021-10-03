import React, { FC, useCallback, useEffect, useState } from 'react';

import Styles from './App.module.scss';

import { Puzzles } from './Puzzles';
import Creature from './Creature';
import CreatureInput from './CreatureInput';
import { IOrganismTemplate } from './Simulator';
import PuzzleResults from './PuzzleResults';

const App: FC<{}> = (props) => {
  const [passedLevels, setPassedLevels] = useState<number[]>([]);

  useEffect(() => {
    setPassedLevels(JSON.parse(localStorage.getItem("passed") ?? "[]"));
  }, [setPassedLevels])

  const setLevelPassed = (index: number) => {
    if (!passedLevels.includes(index)) {
      const newPassedLevels = [...passedLevels, index];
      localStorage.setItem("passed", JSON.stringify(newPassedLevels))
      setPassedLevels(newPassedLevels);
    }
  }

  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState<number | null>(null);
  const [currentOrganisms, setCurrentOrganisms] = useState<IOrganismTemplate[]>([]);
  const [currentSeed, setCurrentSeed] = useState(1);

  const onPuzzleSelected = useCallback((index: number) => {
    const lastOrganisms = JSON.parse(localStorage.getItem("puzzle" + index.toString()) ?? "[]");
    if (lastOrganisms.length > 0) {
      setCurrentOrganisms(lastOrganisms);
    }
    else {
      setCurrentOrganisms([...Puzzles[index].defaultPlayerOrganisms]);
    }

    setCurrentSeed(Number.parseInt(localStorage.getItem("seed" + index.toString()) ?? "1"));

    setSelectedPuzzleIndex(index);
  }, [setSelectedPuzzleIndex, setCurrentOrganisms, setCurrentSeed])

  const onTemplateChanged = useCallback((organismTemplate: IOrganismTemplate, index: number) => {
    setCurrentOrganisms(organisms => {
      const newOrganisms = [...organisms];
      newOrganisms.splice(index, 1, organismTemplate);
      if (Puzzles[selectedPuzzleIndex!].playerOrganismsPassConstraints(newOrganisms)) {
        localStorage.setItem("puzzle" + selectedPuzzleIndex!.toString(), JSON.stringify(newOrganisms));
        return newOrganisms;
      }
      else {
        return organisms;
      }
    })
  }, [setCurrentOrganisms, selectedPuzzleIndex]);

  const reseed = useCallback(() => {
    setCurrentSeed(s => {
      localStorage.setItem("seed" + selectedPuzzleIndex!.toString(), (s + 1).toString());
      return s + 1;
    });
  }, [setCurrentSeed, selectedPuzzleIndex]);

  const selectedPuzzle = selectedPuzzleIndex === null
    ? null
    : Puzzles[selectedPuzzleIndex];

  return <>
    <div className={Styles["app"]}>
      <div className={Styles["header"]}>
        <h1>Nekoequilibrize<span style={{fontSize: "0.375em", paddingLeft: "1em"}}>猫エクリブライズ</span></h1>
        <h3>equilibrize the worlds</h3>
      </div>
      <div className={Styles["puzzleListContainer"]}>
        <div className={Styles["puzzleList"]}>
          {Puzzles.map((p, i) => 
            <button 
              key={i} 
              onClick={() => onPuzzleSelected(i)}
              className={(selectedPuzzleIndex === i ? "selected" : undefined) + " " + (passedLevels.includes(i) ? "passed" : "")}
            >
              world {i + 1}
            </button>  
          )}
        </div>
      </div>
    </div>

    {selectedPuzzle && 
      <div className={Styles["puzzle"]}>
        <h1>World {selectedPuzzleIndex! + 1}</h1>
        <div className={Styles["puzzleContainer"]}>
          <div className={Styles["puzzleText"]}>
            {selectedPuzzle.description}
            
            {selectedPuzzle.organismTemplates.map((ot, i) => 
              <Creature key={i} template={ot} />
            )}
          </div>
          <div className={Styles["puzzleContent"]}>
            
            <PuzzleResults 
                puzzle={selectedPuzzle} 
                playerOrganisms={currentOrganisms}
                seed={Math.PI / 10 * currentSeed}
                reseed={reseed}
                onLevelPassed={() => setLevelPassed(selectedPuzzleIndex!)}
            />
            {currentOrganisms.map((ot, i) => 
              <CreatureInput key={i} template={ot} onTemplateChanged={newot => onTemplateChanged(newot, i)} />
            )}
          </div>
        </div>
      </div>
    }
  </>
}

export default App;