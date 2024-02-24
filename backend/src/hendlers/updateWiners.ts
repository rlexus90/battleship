import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { sendMessage } from '../helpers/sendMessage';
import { WebSocketId } from '../types/webSocket';

export const updateWiners = (
  _msg: IServerMessage,
  _ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const players = DB.players;
  const data = players.map<Winer>((player) => {
    return { name: player.name, wins: player.wins || 0 };
  });

  wss.clients.forEach((client) =>
    sendMessage(client as WebSocketId, EnumTypes.update_winners, data),
  );
};

interface Winer {
  name: string;
  wins: number;
}
