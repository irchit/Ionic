// src/services/storage.ts
import { Storage } from '@ionic/storage';

export const authenticatedStorage = new Storage();

(async () => {
  await authenticatedStorage.create();
})();

// Utility functions for saving/loading data:
export async function saveComicsOffline(comics: any[]) {
  await authenticatedStorage.set('comics', comics);
}

export async function loadComicsOffline(): Promise<any[] | null> {
  return await authenticatedStorage.get('comics');
}

export async function savePendingChanges(changes: any[]) {
  await authenticatedStorage.set('pendingChanges', changes);
}

export async function loadPendingChanges(): Promise<any[] | null> {
  return await authenticatedStorage.get('pendingChanges');
}
