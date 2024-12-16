import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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

import ComicList from './pages/comics/ComicList';
import ComicDetail from './pages/comics/ComicDetail';
import ComicForm from './pages/comics/ComicForm';
import { Storage } from '@ionic/storage';
import { useEffect, useState } from 'react';
import LoginPage from './pages/login/LoginPage';

const storage = new Storage();
await storage.create();

setupIonicReact();

const App: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await storage.get('token');
      if (token) {
        // Optionally, verify token or just trust it for now
        setAuthenticated(true);
      }
      setAuthChecked(true);
    })();
  }, []);

  if (!authChecked) {
    return <IonLoading isOpen={true} message={"Checking authentication..."} />;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {authenticated ? (
            <>
              <Route path="/comics" component={ComicList} exact />
              <Route path="/comic/:id" component={ComicDetail} exact />
              <Route path="/comic/:id/edit" component={ComicForm} exact />
              <Route exact path="/" render={() => <Redirect to="/comics" />} />
            </>
          ) : (
            <>
              <Route path="/login" component={LoginPage} exact />
              <Route exact path="/" render={() => <Redirect to="/login" />} />
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};


export default App;
