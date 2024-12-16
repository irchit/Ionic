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

interface ItemEditProps extends RouteComponentProps<{ id?: string }> {}

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
    const selectedItem = items?.find((it) => `${it.id}` === routeId);
    setItem(selectedItem);

    if (selectedItem) {
      setName(selectedItem.name || '');
      setReleaseDate(selectedItem.release_date || '');
      setIssue(selectedItem.issue || 0);
      setInStock(selectedItem.in_stock || false);
    }
  }, [match.params.id, items]);

  const handleSave = () => {
    const editedItem = {
      ...(item || {}), // Keep existing item properties
      name,
      release_date,
      issue,
      in_stock
    };
    saveItem?.(editedItem).then(() => history.goBack());
  };

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add/Modify</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Title"
          value={name}
          onIonChange={(e) => setName(e.detail.value || '')}
        />
        <IonInput
          type="date"
          placeholder={new Date().toISOString().split('T')[0]}
          value={release_date || ''}
          onIonChange={(e) => setReleaseDate(e.detail.value || '')}
        />
        <IonInput
          min={issue}
          value={issue}
          type="number"
          onIonChange={(e) => setIssue(parseInt(e.detail.value || ''))}
        />
        <IonCheckbox
          checked={item ? item.in_stock : in_stock}
          onIonChange={(e) => setInStock(e.detail.checked)}
        >
          In Stock
        </IonCheckbox>
        <IonLoading isOpen={saving} />
        {savingError && <div>{savingError.message || 'Failed to save item'}</div>}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
