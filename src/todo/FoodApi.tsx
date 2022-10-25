import axios from 'axios';

import {getLogger} from "../core";
import {FoodProps} from "./FoodProps";

const log = getLogger('foodApi');

const baseUrl = 'localhost:3000';
const foodUrl = `http://${baseUrl}/food`;

interface ResponseProps<T> {
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getFoods: () => Promise<FoodProps[]> = () => {
    return withLogs(axios.get(foodUrl, config), 'getFoods');
}

export const createFood: (food: FoodProps) => Promise<FoodProps[]> = food => {
    return withLogs(axios.post(foodUrl, food, config), 'createFood');
}

export const updateFood: (food: FoodProps) => Promise<FoodProps[]> = food => {
    return withLogs(axios.put(`${foodUrl}/${food.id}`, food, config), 'updateFood');
}

//cum arata un mesaj ce vine prin web socket
interface MessageData {
    event: string;
    payload: {
        food: FoodProps;
    };
}

//comunicarea prin web sockets
export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`) //crearea unui web socket
    ws.onopen = () => {
        log('web socket onopen');
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}