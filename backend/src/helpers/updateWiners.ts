import { WebSocketServer } from 'ws';
import { EnumTypes } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { sendMessage } from './sendMessage';
import { WebSocketId } from '../types/webSocket';
import { print } from './print';

export const updateWiners = (wss: WebSocketServer) => {
  const players = DB.players;
  const data = players
    .map<Winer>((player) => {
      return { name: player.name, wins: player.wins || 0 };
    })
    .filter((player) => player.wins !== 0)
    .sort((a, b) => b.wins - a.wins);

  try {
    wss.clients.forEach((client) =>
      sendMessage(client as WebSocketId, EnumTypes.update_winners, data),
    );
  } catch {
    print('Some went wrong', 'red');
  }
};

interface Winer {
  name: string;
  wins: number;
}
