import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonCheckbox } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const ComicEdit: React.FC = () => {
  const [issue, setIssue] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [inStock, setInStock] = useState<boolean>(true);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/comic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issue, name, in_stock: inStock })
    });
    if (response.ok) {
      history.push('/comics');
    } else {
      const err = await response.json();
      console.error(err.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/comics" />
          </IonButtons>
          <IonTitle>New Comic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput value={name} onIonChange={e => setName(e.detail.value!)} placeholder="Enter comic name" required />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Issue</IonLabel>
            <IonInput type="number" value={issue} onIonChange={e => setIssue(parseInt(e.detail.value!, 10))} required />
          </IonItem>
          <IonItem>
            <IonLabel>In Stock</IonLabel>
            <IonCheckbox checked={inStock} onIonChange={e => setInStock(e.detail.checked)} />
          </IonItem>
          <IonButton expand="full" type="submit" style={{ marginTop: '1rem' }}>
            Save
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ComicEdit;
