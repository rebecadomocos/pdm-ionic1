import {FoodProps} from "./FoodProps";
import {IonItem, IonLabel} from "@ionic/react";
import React, {useCallback} from "react";
// @ts-ignore
import dateFormat, { masks } from "dateformat";

interface FoodPropsEdit extends FoodProps {
    onEdit: (id?: string) => void;
}

const Food: React.FC<FoodPropsEdit> = ({id, name, price, expirationDate, inStock, onEdit}) => {
    const handleEdit = useCallback(() => onEdit(id), [id, onEdit]);
    return (
        <IonItem onClick={handleEdit}>
            <IonLabel>{name}</IonLabel>
            <IonLabel>{price}</IonLabel>
            <IonLabel>{dateFormat(expirationDate, "yyyy-mm-dd")}</IonLabel>
            <IonLabel>{inStock ? "in stock" : "not in stock"}</IonLabel>
        </IonItem>
    );
}

export default Food;