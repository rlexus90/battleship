import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { hendlers } from '../hendlers/hendlers';

export const getMessage = (
  msg: IServerMessage,
  ws: WebSocket,
  wss: WebSocketServer,
) => {
  hendlers.get(msg.type)(msg, ws, wss);
};
