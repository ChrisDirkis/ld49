import React, { FC, useCallback, useState } from 'react';

import Styles from './App.module.scss';

import { Puzzles } from './Puzzles';
import Creature from './Creature';
import CreatureInput from './CreatureInput';
import { defaultOrganismTemplate, IOrganismTemplate, simulate } from './Simulator';

const App: FC<{}> = (props) => {
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState<number | null>(null);
  const [currentOrganisms, setCurrentOrganisms] = useState<IOrganismTemplate[]>([]);

  const onPuzzleSelected = useCallback((index: number) => {
    const lastOrganisms = JSON.parse(localStorage.getItem(index.toString()) ?? "[]");
    if (lastOrganisms.length > 0) {
      setCurrentOrganisms(lastOrganisms);
    }
    else {
      setCurrentOrganisms([...Puzzles[index].defaultPlayerOrganisms]);
    }
    setSelectedPuzzleIndex(index);
  }, [setSelectedPuzzleIndex, setCurrentOrganisms])

  const onTemplateChanged = useCallback((organismTemplate: IOrganismTemplate, index: number) => {
    setCurrentOrganisms(organisms => {
      const newOrganisms = [...organisms];
      newOrganisms.splice(index, 1, organismTemplate);
      if (Puzzles[selectedPuzzleIndex!].playerOrganismsPassConstraints(newOrganisms)) {
        localStorage.setItem(selectedPuzzleIndex!.toString(), JSON.stringify(newOrganisms));
        return newOrganisms;
      }
      else {
        return organisms;
      }
    })
  }, [setCurrentOrganisms, selectedPuzzleIndex]);

  if (selectedPuzzleIndex !== null) {
    console.log(simulate(Puzzles[selectedPuzzleIndex], currentOrganisms, 987654321.1234556));
  }

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
              className={selectedPuzzleIndex === i ? "selected" : undefined}
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
          </div>
          <div className={Styles["puzzleContent"]}>
            {currentOrganisms.map((ot, i) => 
              <CreatureInput key={i} template={ot} onTemplateChanged={newot => onTemplateChanged(newot, i)} />
            )}
            {selectedPuzzle.organismTemplates.map((ot, i) => 
              <Creature key={i} template={ot} />
            )}
            
          </div>
        </div>
      </div>
    }
  </>
}

function range(count: number) { return [...Array(count).keys()] }

export default App;