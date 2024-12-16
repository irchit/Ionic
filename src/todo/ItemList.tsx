import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { NetworkState } from '../pages/NetworkState';
import { AuthContext } from '../auth/AuthProvider';
import ItemProps from './ItemProps'; 

const log = getLogger('ItemList');
const itemsPerPage = 15;

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);

  const [index, setIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [itemsAux, setItemsAux] = useState<ItemProps[] | undefined>([]);
  const [more, setHasMore] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [maxIssue, setMaxIssue] = useState<number | undefined>();

  function handleLogout() {
    logout?.();
    history.push('/login');
  }
  log('render', fetching);

  useEffect(() => {
    if (fetching) setIsOpen(true);
    else setIsOpen(false);
  }, [fetching]);

  // Pagination
  useEffect(() => {
    filterAndSearchItems();
  }, [items, searchTerm, maxIssue]);

  function filterAndSearchItems() {
    if (items) {
      let filteredItems = items;

      // Filter by search term (name)
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by max issue number
      if (maxIssue !== undefined) {
        filteredItems = filteredItems.filter(item => item.issue <= maxIssue);
      }

      const newIndex = Math.min(index + itemsPerPage, filteredItems.length);
      setItemsAux(filteredItems.slice(0, newIndex));
      setIndex(newIndex);
      setHasMore(newIndex < filteredItems.length);
    }
  }

  async function searchNext(event: CustomEvent<void>) {
    await filterAndSearchItems();
    await (event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comic List of Current Store</IonTitle>
          <NetworkState />
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={fetching} message="Fetching items" />

        {/* Search and Filter Inputs */}
        <IonItem>
          <IonLabel style={{ padding: '1vw' }}>Search Name</IonLabel>
          <IonInput
            value={searchTerm}
            placeholder="Enter name"
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            debounce={300} // Real-time with a debounce to reduce rapid state updates
          />
        </IonItem>
        <IonItem>
          <IonLabel style={{ padding: '1vw' }}>Max Issue</IonLabel>
          <IonInput
            type="number"
            value={maxIssue}
            placeholder="Enter max issue"
            onIonInput={(e) => setMaxIssue(e.detail.value ? parseInt(e.detail.value) : undefined)}
          />
        </IonItem>

        {itemsAux && (
          <IonList>
            {itemsAux.map(({ id, name, release_date, issue, in_stock }) => (
              <Item
                key={id}
                id={id}
                name={name}
                issue={issue}
                release_date={release_date}
                in_stock={in_stock}
                onEdit={(id) => history.push("/item/" + `${id}`)}
              />
            ))}
          </IonList>
        )}
        <IonInfiniteScroll
          threshold="100px"
          disabled={!more}
          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
        >
          <IonInfiniteScrollContent loadingText="Loading more items..." />
        </IonInfiniteScroll>
        {fetchingError && <div>{fetchingError.message || 'Failed to fetch items'}</div>}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonToast isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} message="Fetching items..." duration={2000} />
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
