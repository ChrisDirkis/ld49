import React, { FC } from 'react';

import Styles from './App.module.scss';
import './Root.scss';

const App: FC<{}> = (props) => {
  return (
    <div className={Styles["app"]}>
      <div className={Styles["header"]}>
        <h1>Nekodarwin</h1>
        <h2>猫ダーウィン</h2>
        save the worlds  
      </div>
    </div>
  );
}

export default App;
