import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';
import { DB } from '../dataBase/dataBase';
import { returnCurrentPlayer } from './returnCurrent';
import { updateWiners } from './updateWiners';

export const deleteGame = (
  gameIndex: number,
  player: Player,
  wss: WebSocketServer,
) => {
  DB.deleteGame(gameIndex);
  DB.deleteRoom(gameIndex);

  const winner = returnCurrentPlayer(player.id);
  winner.wins += 1;
  updateWiners(wss);
};
