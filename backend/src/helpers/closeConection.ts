import { WebSocketServer } from 'ws';
import { WebSocketId } from '../types/webSocket';
import {
  AnswerFinishData,
  EnumTypes,
  IServerMessage,
} from '../types/iServerMsg';
import { sendMessage } from './sendMessage';
import { updateWiners } from './updateWiners';
import { print } from './print';
import { DB } from '../dataBase/dataBase';
import { returnCurrentPlayer } from './returnCurrent';
import { updateRoom } from './updateRoom';

export const closeConection = (ws: WebSocketId, wss: WebSocketServer) => {
  const [game] = DB.games.filter((game) =>
    game.players.some((player) => player.id === ws.id),
  );
  const disconectedPlayer = returnCurrentPlayer(ws.id);

  const rooms =
    DB.rooms.filter((room) =>
      room.roomUsers.some((user) => user.name === disconectedPlayer.name),
    ) || [];

  if (rooms.length) {
    rooms.forEach((room) => DB.deleteRoom(room.roomId));
    updateRoom({} as IServerMessage, ws, wss);
  }
  if (!game) return;

  const [player] = game.players.filter((player) => player.id !== ws.id);

  const winner = returnCurrentPlayer(player.id);
  winner.wins += 1;
  const data: AnswerFinishData = {
    winPlayer: winner.index,
  };
  try {
    wss.clients.forEach((client: WebSocketId) => {
      if (client.id === winner.id) sendMessage(client, EnumTypes.finish, data);
    });
  } catch {
    print('Some went wrong', 'red');
  }
  updateWiners(wss);
  DB.deleteGame(game.idGame);
};
