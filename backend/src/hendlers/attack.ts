import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { returnCurrentGame } from '../helpers/returnCurrent';

export const attack = (
  msg: IServerMessage,
  _ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  const data: IncomingData = JSON.parse(msg.data);
  const { gameId, indexPlayer, x, y } = data;
  const currentGame = returnCurrentGame(gameId);
  currentGame.gameSesion.shoot(indexPlayer, x, y);
};

type IncomingData = {
  gameId: number;
  indexPlayer: number;
  x: number;
  y: number;
};
