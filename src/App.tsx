import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import ComicList from './comics/ComicList';
import ComicDetail from './comics/ComicDetail';
import ComicForm from './comics/ComicForm';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/comics" component={ComicList} exact={true} />
        <Route path="/comic/new" component={ComicForm} exact={true} />
        <Route path="/comic/:id/edit" component={ComicForm} exact={true} />
        <Route path="/comic/:id" component={ComicDetail} exact={true} />
        <Route exact path="/" render={() => <Redirect to="/comics" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
