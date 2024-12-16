// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
import { login } from '../../services/auth';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      history.push('/comics');
    } else {
      alert('Login failed');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton expand="full" onClick={handleLogin}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
