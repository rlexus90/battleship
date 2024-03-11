import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { print } from '../helpers/print';
import { updateRoom } from '../helpers/updateRoom';
import { returnCurrentPlayer } from '../helpers/returnCurrent';

export const createRoom = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const curentPlayer = returnCurrentPlayer(ws.id);
  if (!curentPlayer) return;

  const room: IRoom = {
    roomId: Date.now(),
    roomUsers: [{ name: curentPlayer.name, index: curentPlayer.index }],
  };
  DB.pushRoom(room);
  updateRoom(msg, ws, wss);
  print('New room created', 'green');
};
