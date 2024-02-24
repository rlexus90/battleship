import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { print } from '../helpers/print';
import { updateRoom } from './updateRoom';

export const createRoom = (
  _msg: IServerMessage,
  ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  const curentPlayer = DB.players.filter((player) => player.id === ws.id);
  const room: IRoom = {
    roomId: Date.now(),
    roomUsers: [{ name: curentPlayer[0].name, index: curentPlayer[0].index }],
  };
  DB.pushRoom(room);
  updateRoom(_msg, ws, _wss);
  print('New room created', 'green');
};
