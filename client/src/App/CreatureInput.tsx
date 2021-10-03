import { FC } from "react";

import Styles from './Creature.module.scss';
import { getEnergyCost, IOrganismTemplate } from "./Simulator";


interface ICreatureProps {
    template: IOrganismTemplate;
    onTemplateChanged: (template: IOrganismTemplate) => void;
}

const CreatureInput: FC<ICreatureProps> = ({template, onTemplateChanged}) => {

    function changeValue(key: keyof IOrganismTemplate, value: any) {
        if (typeof value === "number") {
            value = Math.max(Math.round(value), 0);
        }
        const newTemplate = {...template, [key]: value};
        onTemplateChanged(newTemplate);
    }

    return <div className={Styles["creature"]}>
        <h2 className={Styles["creatureName"]}>
            {template.name ?? "cool cat"} (energy requirement: {getEnergyCost(template)})
        </h2>
        {template.name && <img src={template.image} alt={`stylized ${template.name}`} className={Styles["creatureImage"]} />}
        <div className={Styles["creatureNumerics"]}>
            {template.noWeaponsInput 
                ? <span>{template.weapons} weapons</span>
                : <label><input type="number" value={template.weapons} onChange={e => changeValue("weapons", e.target.valueAsNumber)} /> weapons</label>
            }
            {template.noArmourInput 
                ? <span>{template.armour} armour</span>
                : <label><input type="number" value={template.armour} onChange={e => changeValue("armour", e.target.valueAsNumber)} /> armour</label>
            }
            {template.noSpeedInput 
                ? <span>{template.speed} speed</span>
                : <label><input type="number" value={template.speed} onChange={e => changeValue("speed", e.target.valueAsNumber)} /> speed</label>
            }
        </div>
        <div className={Styles["creatureBooleans"]}>
            
        {template.noSeedsInput
            ?  template.eatsSeeds && <span>eats seeds</span>
            : <label><input type="checkbox" checked={template.eatsSeeds} onChange={e => changeValue("eatsSeeds", e.target.checked)} />eats seeds</label>
        }        
        {template.noGrassInput
            ?  template.eatsGrass && <span>eats grass</span>
            : <label><input type="checkbox" checked={template.eatsGrass} onChange={e => changeValue("eatsGrass", e.target.checked)} />eats grass</label>
        }        
        {template.noLeavesInput
            ?  template.eatsLeaves && <span>eats leaves</span>
            : <label><input type="checkbox" checked={template.eatsLeaves} onChange={e => changeValue("eatsLeaves", e.target.checked)} />eats leaves</label>
        }
        </div>
    </div>
}


export default CreatureInput;