// src/components/NetworkIndicator.tsx
import React from 'react';
import { IonBadge } from '@ionic/react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkIndicator: React.FC = () => {
  const { connected } = useNetworkStatus();
  return (
    <IonBadge color={connected ? 'success' : 'danger'}>
      {connected ? 'Online' : 'Offline'}
    </IonBadge>
  );
};

export default NetworkIndicator;
