import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';
import { print } from './print';
import { WebSocketId } from '../types/webSocket';
import { sendMessage } from './sendMessage';
import { EnumTypes } from '../types/iServerMsg';

export const turn = (
  playerOne: Player,
  playerTwo: Player,
  current: number,
  wss: WebSocketServer,
) => {
  const data: OutputData = {
    currentPlayer: current,
  };

  try {
    wss.clients.forEach((client: WebSocketId) => {
      if (client.id === playerOne.id || client.id === playerTwo.id)
        sendMessage(client, EnumTypes.turn, data);
    });
  } catch {
    print('Some went wrong', 'red');
  }
};

type OutputData = {
  currentPlayer: number;
};
