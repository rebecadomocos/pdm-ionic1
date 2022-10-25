import {getLogger} from "../core";
import {FoodProps} from "./FoodProps";
import React, {useCallback, useEffect, useReducer} from "react";
import PropTypes from "prop-types";
import {createFood, getFoods, newWebSocket, updateFood} from "./FoodApi";

const log = getLogger('FoodProvider');

type SaveFoodFn = (food: FoodProps) => Promise<any>;

export interface FoodState {
    foods?: FoodProps[],
    fetching: boolean;
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveFood?: SaveFoodFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: FoodState = {
    fetching: false,
    saving: false,
};

const FETCH_FOOD_STARTED = 'FETCH_FOOD_STARTED';
const FETCH_FOOD_SUCCEEDED = 'FETCH_FOOD_SUCCEEDED';
const FETCH_FOOD_FAILED = 'FETCH_FOOD_FAILED';
const SAVE_FOOD_STARTED = 'SAVE_FOOD_STARTED';
const SAVE_FOOD_SUCCEEDED = 'SAVE_FOOD_SUCCEEDED';
const SAVE_FOOD_FAILED = 'SAVE_FOOD_FAILED';

const reducer: (state: FoodState, action: ActionProps) => FoodState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_FOOD_STARTED:
                return {...state, fetching: true, fetchingError: null};
            case FETCH_FOOD_SUCCEEDED:
                return {...state, fetching: false, foods: payload.foods};
            case FETCH_FOOD_FAILED:
                return {...state, fetching: false, fetchingError: payload.error};
            case SAVE_FOOD_STARTED:
                return {...state, saving: true, savingError: null};
            case SAVE_FOOD_SUCCEEDED:
                const foods = [...(state.foods || [])];
                const food = payload.food;
                const index = foods.findIndex(it => it.id === food.id);
                if (index === -1) {
                    foods.splice(0, 0, food);
                } else {
                    foods[index] = food;
                }
                return {...state, foods, saving: false};
            case SAVE_FOOD_FAILED:
                return {...state, saving: false, savingError: payload.error};
            default:
                return state;

        }
    };

export const FoodContext = React.createContext<FoodState>(initialState);

interface FoodProviderProps {
    children: PropTypes.ReactNodeLike;
}

export const FoodProvider: React.FC<FoodProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {foods, fetching, fetchingError, saving, savingError} = state;
    useEffect(getFoodEffect, []);
    useEffect(wsEffect, []);
    const saveFood = useCallback<SaveFoodFn>(saveFoodCallback, []);
    const value = {foods, fetching, fetchingError, saving, savingError, saveFood};
    log('returns');
    return (
        <FoodContext.Provider value={value}>
            {children}
        </FoodContext.Provider>
    )

    function getFoodEffect() {
        let canceled = false;
        fetchFoods();
        return() => {
            canceled = true;
        }

        async function fetchFoods() {
            try {
                log('fetchFoods started');
                dispatch({type: FETCH_FOOD_STARTED});
                const foods = await getFoods();
                log('fetchFoods succeeded');
                if (!canceled) {
                    dispatch({type: FETCH_FOOD_SUCCEEDED, payload: {foods}});
                }
            } catch (error) {
                log('fetchFoods failed');
                dispatch({type: FETCH_FOOD_FAILED, payload: {error}});
            }
        }
    }

    async function saveFoodCallback(food: FoodProps) {
        try {
            log('saveFood started');
            dispatch({type: SAVE_FOOD_STARTED});
            const savedFood = await (food.id ? updateFood(food) : createFood(food));
            log('saveFood succeeded');
            dispatch({type: SAVE_FOOD_SUCCEEDED, payload: {food: savedFood}});
        } catch (error) {
            log('saveFood failed');
            dispatch({type: SAVE_FOOD_FAILED, payload: {error}});
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }
            const { event, payload: { food }} = message;
            log(`ws message, food ${event}`);
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_FOOD_SUCCEEDED, payload: { food: food } });
            }
        });
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket();
        }
    }

}

