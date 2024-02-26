import ws from 'ws';
import { print } from '../helpers/print';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { Bot } from '../bot/bot';
import { DB } from '../dataBase/dataBase';

export const playWithBot = (
  _msg: IServerMessage,
  ws: WebSocketId,
  wss: ws.WebSocketServer,
) => {
  print('Game with bot not support', 'yellow');
  try {
    DB.pushBot(new Bot(ws.id, wss));
  } catch {
    print('Some went wrong', 'red');
  }
};
