import React, { useEffect, useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonFab, 
  IonFabButton, 
  IonIcon, 
  IonButton, 
  IonButtons 
} from '@ionic/react';
import { add as addIcon, trash as trashIcon } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface Comic {
  id: number;
  issue: number;
  name: string;
  release_date: string;
  in_stock: boolean;
}

const ComicList: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch comics from server
    fetch('http://localhost:3000/comic')
      .then(res => res.json())
      .then(data => setComics(data))
      .catch(err => console.error('Error fetching comics:', err));

    // Setup WebSocket
    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (msg) => {
      const { event, payload } = JSON.parse(msg.data);
      if (event === 'created') {
        setComics(prev => [...prev, payload.comic]);
      } else if (event === 'updated') {
        setComics(prev => prev.map(c => c.id === payload.comic.id ? payload.comic : c));
      } else if (event === 'deleted') {
        setComics(prev => prev.filter(c => c.id !== payload.comic.id));
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleAddComic = async () => {
    // Find max id
    const maxId = comics.length > 0 ? Math.max(...comics.map(c => c.id)) : 0;

    // Create a new comic with default values
    const newComic = {
      issue: maxId + 1,
      name: 'New Comic',
      release_date: new Date().toISOString(),
      in_stock: true
    };

    const response = await fetch('http://localhost:3000/comic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComic)
    });

    if (response.ok) {
      const created = await response.json();
      history.push(`/comic/${created.id}/edit`);
    } else {
      const err = await response.json();
      console.error('Error creating comic:', err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`http://localhost:3000/comic/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      // Optimistically update local state to remove the comic
      setComics(prev => prev.filter(c => c.id !== id));
    } else {
      const err = await response.json();
      console.error('Error deleting comic:', err.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {comics.map((comic) => (
            <IonItem key={comic.id}>
              <IonLabel
                className="ion-text-wrap"
                onClick={() => history.push(`/comic/${comic.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h2>{comic.name}</h2>
                <p>
                  Issue #{comic.issue}, Released: {new Date(comic.release_date).toLocaleDateString()}, In Stock: {comic.in_stock ? 'Yes' : 'No'}
                </p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={() => handleDelete(comic.id)}>
                  <IonIcon slot="icon-only" icon={trashIcon} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddComic}>
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ComicList;
