import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { IPlayer } from '../types/player';
import { sendMessage } from './sendMessage';
import { print } from '../helpers/print';

export const registration = (
  msg: IServerMessage,
  ws: WebSocket,
  _wss: WebSocketServer,
) => {
  const players = DB.players;
  const data = JSON.parse(msg.data) as IncomingData;

  players.filter((player) => player.name === data.name);

  if (players.length === 0) {
    const player: IPlayer = {
      name: data.name,
      password: data.password,
      index: Date.now(),
    };
    const answer: OutputData = {
      name: player.name,
      index: player.index,
      error: false,
    };
    DB.players.push(player);
    sendMessage(ws, EnumTypes.reg, answer);
    print('New Player', 'green');
    return;
  }

  const player = players[0];
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