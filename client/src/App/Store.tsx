import React, { createContext, FC, useReducer } from 'react';

export interface IStateAction<Action, Payload> {
    type: Action,
    payload: Payload;
}

export interface IGameContext {
    [puzzle: number]: {
        attempts: Attempt[]
    }
}

export interface Attempt {

}

export interface IAddAttempt extends IStateAction<"addAttempt", { puzzle: number, attempt: Attempt} > { }

export type GameAction = IAddAttempt;

function gameReducer(state: IGameContext, action: GameAction) {
    switch (action.type) {
        case "addAttempt":
            return {...state, emails: action.payload};
        default:
            console.warn("Unregistered action: ", action);
            return state;
    }
}

const initialState: IGameContext = { }


type GameStoreContextType = [IGameContext, React.Dispatch<GameAction>]
export const storeProvider = createContext<GameStoreContextType>([initialState, () => initialState]);

export const StoreProvider: FC = props => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const Provider = storeProvider.Provider;

    return <Provider value={[state, dispatch]}>
        {props.children}
    </Provider>
}