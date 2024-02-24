import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { print } from '../helpers/print';
import { updateRoom } from '../helpers/updateRoom';

export const createRoom = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const curentPlayer = DB.players.filter((player) => player.id === ws.id);
  const room: IRoom = {
    roomId: Date.now(),
    roomUsers: [{ name: curentPlayer[0].name, index: curentPlayer[0].index }],
  };
  DB.pushRoom(room);
  updateRoom(msg, ws, wss);
  print('New room created', 'green');
};
