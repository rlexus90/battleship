import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { Ship } from '../types/game';
import { DB } from '../dataBase/dataBase';
import { print } from '../helpers/print';
import { sendMessage } from '../helpers/sendMessage';

export const addShips = (
  msg: IServerMessage,
  _ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as AddShipsData;
  const ifShipsUpdated = DB.updatePlayerShips(data);

  if (!ifShipsUpdated) return print(`Ships can't be added`, 'red');

  const [currentGame] = DB.games.filter((game) => game.idGame === data.gameId);

  const playersWithShips = currentGame.players.filter((player) => player.ships);

  if (playersWithShips.length < 2)
    return print(
      `Ships player_id=${data.indexPlayer} successful added`,
      'yellow',
    );

  wss.clients.forEach((client: WebSocketId) => {
    const [curentPlayer] = playersWithShips.filter(
      (player) => player.id === client.id,
    );
    if (!curentPlayer) return;

    const data: OutputData = {
      ships: curentPlayer.ships,
      currentPlayerIndex: curentPlayer.index,
    };
    sendMessage(client, EnumTypes.start_game, data);
  });

  print(`The game id=${currentGame.idGame} has started`, 'green');
};

export type AddShipsData = {
  gameId: number;
  indexPlayer: number;
  ships: Ship[];
};

type OutputData = {
  ships: Ship[];
  currentPlayerIndex: number;
};
