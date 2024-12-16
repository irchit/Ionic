import React from 'react';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/react';
import ItemProps from './ItemProps'; // Importing Item from ItemProps

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: number) => void; // Use `number` for id as per the `Item` interface
}

const ItemComponent: React.FC<ItemPropsExt> = ({ id, name, issue, release_date, in_stock, onEdit }) => {
  const formattedReleaseDate = parseIsoDate(release_date);

  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>
        <h2>{name}</h2>
        <p>Issue: {issue}</p>
        <p>Release Date: {formattedReleaseDate}</p>
      </IonLabel>
      <IonLabel color={in_stock ? 'success' : 'danger'}>
        {in_stock ? 'In Stock' : 'Out of Stock'}
      </IonLabel>
      <IonCheckbox slot="start" checked={in_stock} />
    </IonItem>
  );
};

function parseIsoDate(dateString: string): string {
  // Extract year, month, and day from the ISO string
  const dateParts = dateString.split('T')[0].split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Return formatted date as dd/MM/yyyy
  return `${day}/${month}/${year}`;
}

export default ItemComponent;
