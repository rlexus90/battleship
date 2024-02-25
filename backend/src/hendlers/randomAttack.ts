import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';

export const randomAttack = (
  msg: IServerMessage,
  _ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  //TODO
  const data: IncomingData = JSON.parse(msg.data);
  console.log('random attack');
  console.log(data);
};

type IncomingData = {
  gameId: number;
  indexPlayer: number;
};
