import { WebSocketServer } from 'ws';
import { EnumTypes } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { IPlayer } from '../types/player';
import { sendMessage } from '../helpers/sendMessage';

export const createGame = (
  room: IRoom,
  player: IPlayer,
  wss: WebSocketServer,
) => {
  const data: OutputData = {
    idGame: room.roomId,
    idPlayer: player.index,
  };

  const users = DB.players.filter((player) =>
    room.roomUsers.some((user) => user.index === player.index),
  );

  DB.pushGame(data);

  wss.clients.forEach((client: WebSocketId) => {
    if (users.some((user) => user.id === client.id))
      sendMessage(client, EnumTypes.create_game, data);
  });
};

type OutputData = {
  idGame: number;
  idPlayer: number;
};
