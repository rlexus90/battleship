import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { hendlers } from '../hendlers/hendlers';
import { WebSocketId } from '../types/webSocket';

export const getMessage = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  hendlers.get(msg.type)(msg, ws, wss);
};
