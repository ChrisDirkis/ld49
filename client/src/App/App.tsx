import React, { FC } from 'react';

import Styles from './App.module.scss';
import './Root.scss';
import { StoreProvider } from './Store';

const App: FC<{}> = (props) => {
  return (
    <StoreProvider>
      <div className={Styles["app"]}>
        <div className={Styles["header"]}>
          <h1>Nekodarwin</h1>
          <h2>猫ダーウィン</h2>
          save the worlds  
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
