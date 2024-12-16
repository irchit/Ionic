// src/pages/comics/ComicList.tsx
import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add as addIcon } from 'ionicons/icons';
import { authenticatedFetch } from '../../services/api';
import { getToken } from '../../services/auth';
import { loadComicsOffline, saveComicsOffline } from '../../services/storage';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useHistory } from 'react-router-dom';
import { connectWebSocket } from '../../services/websocket';

interface Comic {
  id: number;
  issue: number;
  name: string;
  release_date: string;
  in_stock: boolean;
}

const ComicList: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { connected } = useNetworkStatus();
  const history = useHistory();

  const fetchComics = async (reset = false) => {
    if (!connected) {
      const offlineComics = await loadComicsOffline();
      if (offlineComics) setComics(offlineComics);
      return;
    }

    const response = await authenticatedFetch(`http://localhost:3000/comic?search=${encodeURIComponent(searchText)}&page=${reset ? 1 : page}&pageSize=10`);
    const data = await response.json();
    setComics(reset ? data.data : [...comics, ...data.data]);
    setTotal(data.total);
    if (reset) setPage(1);
    await saveComicsOffline(reset ? data.data : [...comics, ...data.data]);
  };

  useEffect(() => {
    // Initial load
    fetchComics(true);

    // WebSocket setup
    connectWebSocket(({ event, payload }) => {
      if (event === 'created') {
        setComics(prev => [...prev, payload.comic]);
      } else if (event === 'updated') {
        setComics(prev => prev.map(c => c.id === payload.comic.id ? payload.comic : c));
      } else if (event === 'deleted') {
        setComics(prev => prev.filter(c => c.id !== payload.comic.id));
      }
    });
    // eslint-disable-next-line
  }, [connected]);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    fetchComics(true);
  };

  const loadMore = async (event: CustomEvent) => {
    if (comics.length >= total) {
      (event.target as HTMLIonInfiniteScrollElement).complete();
      return;
    }
    await fetchComics(false);
    setPage(prev => prev + 1);
    (event.target as HTMLIonInfiniteScrollElement).complete();
  };

  const handleAddComic = async () => {
    // Example of pre-creating a comic and then navigating to its edit page,
    // or just navigate to a "/comic/new" route if you set it up
    history.push('/comic/new');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchText} onIonChange={e => handleSearchChange(e.detail.value!)} />
        <IonList>
          {comics.map((comic) => (
            <IonItem key={comic.id} button onClick={() => history.push(`/comic/${comic.id}`)}>
              <IonLabel>
                <h2>{comic.name}</h2>
                <p>Issue #{comic.issue}, {new Date(comic.release_date).toLocaleDateString()} - {comic.in_stock ? 'In Stock' : 'Out of Stock'}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonInfiniteScroll onIonInfinite={loadMore}>
          <IonInfiniteScrollContent loadingText="Loading more comics..." />
        </IonInfiniteScroll>
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
