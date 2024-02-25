import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { returnCurrentGame } from '../helpers/returnCurrent';

export const randomAttack = (
  msg: IServerMessage,
  _ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  const data: IncomingData = JSON.parse(msg.data);
  const currentGame = returnCurrentGame(data.gameId);
  currentGame.gameSesion.randomAttack(data.indexPlayer);
};

type IncomingData = {
  gameId: number;
  indexPlayer: number;
};
