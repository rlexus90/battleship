import { WebSocketId } from '../types/webSocket';
import { print } from './print';

export const sendMessage = (ws: WebSocketId, type: string, data: unknown) => {
  try {
    ws.send(
      JSON.stringify({
        type,
        data: JSON.stringify(data),
        id: 0,
      }),
    );
  } catch {
    print('Some went wrong', 'red');
  }
};
