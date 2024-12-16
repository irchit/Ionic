import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonButton, IonCheckbox } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';

interface Comic {
  id: number;
  issue: number;
  name: string;
  release_date: string;
  in_stock: boolean;
}

const ComicForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [comic, setComic] = useState<Comic | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comic) return;

    const response = await fetch(`http://localhost:3000/comic/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comic)
    });

    if (response.ok) {
      history.push('/comics');
    } else {
      const err = await response.json();
      console.error(err.message);
    }
  };

  if (!comic) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading Comic...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>Loading comic data...</IonContent>
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
          <IonTitle>Edit Comic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={comic.name}
              onIonChange={e => setComic({ ...comic, name: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Issue</IonLabel>
            <IonInput
              type="number"
              value={comic.issue}
              onIonChange={e => setComic({ ...comic, issue: parseInt(e.detail.value!, 10) })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Release Date</IonLabel>
            <IonInput
              type="date"
              value={new Date(comic.release_date).toISOString().substring(0,10)}
              onIonChange={e => {
                const dateString = e.detail.value!;
                setComic({ ...comic, release_date: new Date(dateString).toISOString() });
              }}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel>In Stock</IonLabel>
            <IonCheckbox
              checked={comic.in_stock}
              onIonChange={e => setComic({ ...comic, in_stock: e.detail.checked })}
            />
          </IonItem>
          <IonButton expand="full" type="submit" style={{ marginTop: '1rem' }}>
            Save
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default ComicForm;
