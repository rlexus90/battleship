import { WebSocketServer } from 'ws';
import { print } from '../helpers/print';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';

export const playWithBot = (
  _msg: IServerMessage,
  _ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  print('Game with bot not support', 'yellow');
};
