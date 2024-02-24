import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { IPlayer } from '../types/player';
import { sendMessage } from '../helpers/sendMessage';
import { print } from '../helpers/print';
import { updateWiners } from './updateWiners';
import { WebSocketId } from '../types/webSocket';
import { updateRoom } from './updateRoom';

export const registration = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as IncomingData;
  const players = DB.players.filter((player) => player.name === data.name);

  if (players.length === 0) {
    const player: IPlayer = {
      name: data.name,
      password: data.password,
      index: Date.now(),
      id: ws.id,
    };
    const answer: OutputData = {
      name: player.name,
      index: player.index,
      error: false,
    };
    DB.pushPlayer(player);
    sendMessage(ws, EnumTypes.reg, answer);
    print('New Player', 'green');
    updateWiners(msg, ws, wss);
    updateRoom(msg, ws, wss);
    return;
  }

  const player = { ...players[0], id: ws.id };
  DB.updatePlayer(player);

  const answer: OutputData =
    player.password === data.password
      ? {
          name: player.name,
          index: player.index,
          error: false,
        }
      : {
          name: player.name,
          index: player.index,
          error: true,
          errorText: 'Wrong pasword or Player already exist',
        };

  sendMessage(ws, EnumTypes.reg, answer);
  updateWiners(msg, ws, wss);
  updateRoom(msg, ws, wss);

  answer.error
    ? print('Player is`nt login', 'red')
    : print('Player successful login ', 'green');
};

interface IncomingData {
  name: string;
  password: string;
}

interface OutputData {
  name: string;
  index: number;
  error: boolean;
  errorText?: string;
}
