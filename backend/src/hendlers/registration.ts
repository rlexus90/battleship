import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { DB } from '../dataBase/dataBase';
import { IPlayer } from '../types/player';
import { sendMessage } from '../helpers/sendMessage';
import { print } from '../helpers/print';
import { updateWiners } from '../helpers/updateWiners';
import { WebSocketId } from '../types/webSocket';
import { updateRoom } from '../helpers/updateRoom';

export const registration = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as IncomingData;
  const [player] = DB.players.filter((player) => player.name === data.name);

  if (!player) {
    const newPlayer: IPlayer = {
      name: data.name,
      password: data.password,
      index: Date.now(),
      id: ws.id,
      wins: 0,
    };
    const answer: OutputData = {
      name: newPlayer.name,
      index: newPlayer.index,
      error: false,
    };
    DB.pushPlayer(player);
    sendMessage(ws, EnumTypes.reg, answer);
    print('New Player', 'green');
    updateWiners(wss);
    updateRoom(msg, ws, wss);
    return;
  }

  const updatePlayer = { ...player, id: ws.id };
  DB.updatePlayer(updatePlayer);

  const answer: OutputData =
    updatePlayer.password === data.password
      ? {
          name: updatePlayer.name,
          index: updatePlayer.index,
          error: false,
        }
      : {
          name: updatePlayer.name,
          index: updatePlayer.index,
          error: true,
          errorText: 'Wrong pasword or Player already exist',
        };

  sendMessage(ws, EnumTypes.reg, answer);
  updateWiners(wss);
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
