import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { hendlers } from '../hendlers/hendlers';
import { WebSocketId } from '../types/webSocket';
import { print } from '../helpers/print';

export const getMessage = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  try {
    hendlers.get(msg.type)(msg, ws, wss);
  } catch {
    print('Somesing went wrong', 'red');
  }
};
