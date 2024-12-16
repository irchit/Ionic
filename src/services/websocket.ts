// src/services/websocket.ts
import { getToken } from './auth';

let ws: WebSocket | null = null;

export async function connectWebSocket(onMessage: (data: any) => void) {
  const token = await getToken();
  if (!token) return;

  ws = new WebSocket(`ws://localhost:3000?token=${token}`);
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };
}

export function sendMessage(message: any) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
