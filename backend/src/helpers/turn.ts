import { WebSocketServer } from 'ws';
import { IGame } from '../types/IGame';
import { print } from './print';
import { WebSocketId } from '../types/webSocket';
import { sendMessage } from './sendMessage';
import { EnumTypes } from '../types/iServerMsg';

export const turn = (game: IGame, wss: WebSocketServer) => {
  try {
    wss.clients.forEach((client: WebSocketId) => {
      const [curentPlayer] = game.players.filter(
        (player) => player.id === client.id,
      );
      if (!curentPlayer) return;

      const data: OutputData = {
        currentPlayer: curentPlayer.index,
      };

      sendMessage(client, EnumTypes.turn, data);
    });
  } catch {
    print('Some went wrong', 'red');
  }
};

type OutputData = {
  currentPlayer: number;
};
