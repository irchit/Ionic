import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const { connected } = useNetworkStatus();

interface Comic {
  id: number;
  issue: number;
  name: string;
  release_date: string;
  in_stock: boolean;
}

const ComicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comic, setComic] = useState<Comic | null>(null);
  const history = useHistory();

  useEffect(() => {
    fetch(`http://localhost:3000/comic/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          console.error(data.message);
        } else {
          setComic(data);
        }
      })
      .catch(err => console.error('Error fetching comic:', err));
  }, [id]);

  if (!comic) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>Loading comic details...</IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/comics" />
          </IonButtons>
          <IonTitle>{comic.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push(`/comic/${comic.id}/edit`)}>Edit</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>{comic.name}</h2>
        <p>Issue: {comic.issue}</p>
        <p>Release Date: {new Date(comic.release_date).toLocaleDateString()}</p>
        <p>In Stock: {comic.in_stock ? 'Yes' : 'No'}</p>
      </IonContent>
    </IonPage>
  );
};

export default ComicDetail;
