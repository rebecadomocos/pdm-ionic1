import {getLogger} from "../core";
import {RouteComponentProps} from "react-router";
import React, {useCallback, useContext} from "react";
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader, IonIcon,
    IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import Food from "./Food";
import {FoodContext} from "./FoodProvider";
import {add} from "ionicons/icons";

const log = getLogger('FoodList')

const FoodList: React.FC<RouteComponentProps> = ({history}) => {
    const {foods, fetching, fetchingError} = useContext(FoodContext);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My food app</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching foods"/>
                {foods && (
                    <IonList>
                        {foods.map(({id, name, price, expirationDate, inStock}) =>
                            <Food key={id} id={id} name={name} price={price} expirationDate={expirationDate} inStock={inStock} onEdit={id => history.push(`/food/${id}`)}/>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch foods'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/food')}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}

export default FoodList;