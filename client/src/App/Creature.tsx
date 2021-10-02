import { FC } from "react";

import Styles from './Creature.module.scss';
import { IOrganismTemplate } from "./Simulator";

interface ICreatureProps {
    template: IOrganismTemplate;
}

const Creature: FC<ICreatureProps> = ({template}) => {


    return <div className={Styles["creature"]}>
        <h2 className={Styles["creatureName"]}>
            {template.name}
        </h2>
        <img src={template.image} alt={`stylized ${template.name}`} className={Styles["creatureImage"]} />
        <div className={Styles["creatureNumerics"]}>
            <span>{template.weapons} weapons</span>
            <span>{template.armour} armour</span>
            <span>{template.speed} speed</span>
        </div>
        <div className={Styles["creatureBooleans"]}>
            {template.eatsSeeds && <span>eats seeds</span>}
            {template.eatsGrass && <span>eats grass</span>}
            {template.eatsLeaves && <span>eats leaves</span>}
        </div>
    </div>
}

export default Creature;