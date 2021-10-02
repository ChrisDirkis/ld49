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
            value = Math.max(value, 0);
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
            <label><input type="number" value={template.weapons} onChange={e => changeValue("weapons", e.target.valueAsNumber)} /> weapons</label>
            <label><input type="number" value={template.armour} onChange={e => changeValue("armour", e.target.valueAsNumber)}/> armour</label>
            <label><input type="number" value={template.speed} onChange={e => changeValue("speed", e.target.valueAsNumber)}/> speed</label>
        </div>
        <div className={Styles["creatureBooleans"]}>
            <label><input type="checkbox" checked={template.eatsSeeds} onChange={e => changeValue("eatsSeeds", e.target.checked)} />eats seeds</label>
            <label><input type="checkbox" checked={template.eatsGrass} onChange={e => changeValue("eatsGrass", e.target.checked)} />eats grass</label>
            <label><input type="checkbox" checked={template.eatsLeaves} onChange={e => changeValue("eatsLeaves", e.target.checked)} />eats leaves</label>
        </div>
    </div>
}


export default CreatureInput;