import { WebSocketServer } from 'ws';
import { EnumTypes } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { IPlayer } from '../types/player';
import { sendMessage } from '../helpers/sendMessage';
import { print } from '../helpers/print';
import { IGame, Player } from '../types/game';

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

  const game: IGame = {
    idGame: room.roomId,
    players: users.map<Player>((user) => {
      return {
        index: user.index,
        id: user.id,
      };
    }),
  };

  DB.pushGame(game);
  print(`New game id=${data.idGame} created`, 'green');

  try {
    wss.clients.forEach((client: WebSocketId) => {
      const [curentPlayer] = game.players.filter(
        (player) => player.id === client.id,
      );
      if (!curentPlayer) return;
      const data: OutputData = {
        idGame: room.roomId,
        idPlayer: curentPlayer.index,
      };
      sendMessage(client, EnumTypes.create_game, data);
    });
  } catch {
    print('Some went wrong', 'red');
  }
};

type OutputData = {
  idGame: number;
  idPlayer: number;
};
