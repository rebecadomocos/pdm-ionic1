import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {FoodList} from "./todo";
import FoodEdit from "./todo/FoodEdit";
import React from "react";
import {FoodProvider} from "./todo/FoodProvider";

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <FoodProvider>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route path="/foods" component={FoodList} exact={true}/>
                    <Route path="/food" component={FoodEdit} exact={true}/>
                    <Route path="/food/:id" component={FoodEdit} exact={true}/>
                    <Route exact path="/" render={() => <Redirect to="/foods"/>}/>
                </IonRouterOutlet>
            </IonReactRouter>
        </FoodProvider>
    </IonApp>
);

export default App;
