import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import { PluginListenerHandle } from '@capacitor/core'; 

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    connected: true,
    connectionType: 'wifi'
  });

  useEffect(() => {
    let handle: PluginListenerHandle | undefined;

    const setupNetworkListener = async () => {
      // Get initial status
      const state = await Network.getStatus();
      setStatus({
        connected: state.connected,
        connectionType: state.connectionType || 'unknown'
      });

      // Add the listener and wait for the handle
      handle = await Network.addListener('networkStatusChange', (newState) => {
        setStatus({
          connected: newState.connected,
          connectionType: newState.connectionType || 'unknown'
        });
      });
    };

    setupNetworkListener();

    return () => {
      // Remove the listener on cleanup if handle is set
      if (handle) {
        handle.remove();
      }
    };
  }, []);

  return status;
}
