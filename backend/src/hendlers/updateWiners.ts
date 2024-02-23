import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { sendMessage } from '../helpers/sendMessage';

export const updateWiners = (
  _msg: IServerMessage,
  _ws: WebSocket,
  wss: WebSocketServer,
) => {
  const players = DB.players;
  const data = players.map<Winer>((player) => {
    return { name: player.name, wins: player.wins || 0 };
  });

  wss.clients.forEach((client) =>
    sendMessage(client as unknown as WebSocket, EnumTypes.update_winners, data),
  );
};

interface Winer {
  name: string;
  wins: number;
}
