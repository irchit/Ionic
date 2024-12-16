import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import ItemProps from './ItemProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [item, setItem] = useState<ItemProps>();
  const [name, setName] = useState('');
  const [issue, setIssue] = useState(0);
  const [in_stock, setInStock] = useState(false);
  const [release_date, setReleaseDate] = useState('');

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id?.toString() === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setReleaseDate(item.release_date);
      setIssue(item.issue);
      setInStock(item.in_stock);
    }
  }, [match.params.id, items]);

  const handleSave = () => {
    const editedItem = item ? { ...item, name, release_date, issue, in_stock } : { name, release_date, issue, in_stock };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} />
        <IonInput value={release_date} onIonChange={e => setReleaseDate(e.detail.value || '')} />
        <IonInput value={issue} type="number" onIonChange={e => setIssue(parseInt(e.detail.value || '0'))} />
        <IonCheckbox checked={item ? item.in_stock : in_stock} onIonChange={e => setInStock(e.detail.checked || false)}/>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
