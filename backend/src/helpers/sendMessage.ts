import { WebSocketId } from '../types/webSocket';

export const sendMessage = (ws: WebSocketId, type: string, data: unknown) => {
  ws.send(
    JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    }),
  );
};
