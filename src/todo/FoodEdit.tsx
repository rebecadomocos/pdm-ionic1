// componenta grafica pentru edit
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonDatetime,
    IonHeader,
    IonInput, IonLabel,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {FoodContext} from './FoodProvider';
import {RouteComponentProps} from 'react-router';
import {FoodProps} from './FoodProps';
import {getLogger} from "../core";
import {format} from "util";

const log = getLogger('FoodEdit');

interface FoodEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const FoodEdit: React.FC<FoodEditProps> = ({history, match}) => {
    const {foods, saving, savingError, saveFood} = useContext(FoodContext); //ce as putea sa modific in clasa asta
    const [name, setText] = useState(''); //vreau ca pt var mea text sa am o functie setText care acest text va fi ''
    const [expirationDate, setExpirationDate] = useState(new Date(Date.now()));
    const [price, setPrice] = useState(10);
    const [inStock, setStock] = useState(true);
    const [food, setFood] = useState<FoodProps>();
    useEffect(() => { //cand apas save, e un hook
        log('useEffect');
        const routeId = match.params.id || '';
        const food = foods?.find(it => it.id === routeId); //constr un food cu id
        setFood(food); //functie de setare a campurilor
        if (food) {
            setText(food.name);
            setPrice(food.price);
            setExpirationDate(food.expirationDate);
            setStock(food.inStock);
        }
    }, [match.params.id, foods]);
    const handleSave = useCallback(() => {
        const editedFood = food ? {...food, name, price, expirationDate, inStock} : {name, price, expirationDate, inStock};
        saveFood && saveFood(editedFood).then(() => history.goBack());
    }, [food, saveFood, name, price, expirationDate, inStock, history]);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput value={name} onIonChange={e => setText(e.detail.value || '')}/>
                <input type={"number"} value={price} onChange={e => setPrice(Number(e.currentTarget.value))}/>
                <input type={"date"} value={new Date(expirationDate).toISOString().split('T')[0]} onChange={e => setExpirationDate(new Date(e.currentTarget.value))}/>
                <IonCheckbox checked={inStock} onIonChange={e=>{console.log(e.detail.checked); setStock(e.detail.checked)}}/>
                <IonLabel>In Stock</IonLabel>
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save food'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default FoodEdit;
