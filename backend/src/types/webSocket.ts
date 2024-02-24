import ws from 'ws';

export interface WebSocketId extends ws {
  id: string;
}
