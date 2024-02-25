import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { Ship } from '../types/IGame';
import { DB } from '../dataBase/dataBase';
import { print } from '../helpers/print';
import { sendMessage } from '../helpers/sendMessage';
import { Game } from '../game/Game';
import { returnCurrentGame } from '../helpers/returnCurrent';

export const addShips = (
  msg: IServerMessage,
  _ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as AddShipsData;
  const ifShipsUpdated = DB.updatePlayerShips(data);

  if (!ifShipsUpdated) return print(`Ships can't be added`, 'red');

  const currentGame = returnCurrentGame(data.gameId);

  const playersWithShips = currentGame.players.filter((player) => player.ships);

  if (playersWithShips.length < 2)
    return print(
      `Ships player_id=${data.indexPlayer} successful added`,
      'yellow',
    );

  currentGame.gameSesion = new Game(currentGame.players, wss);
  DB.updateGame(currentGame);

  try {
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
    currentGame.gameSesion.turn();
  } catch {
    print('Some went wrong', 'red');
  }
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
