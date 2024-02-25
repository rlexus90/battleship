import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { updateRoom } from '../helpers/updateRoom';
import { createGame } from '../helpers/createGame';
import { print } from '../helpers/print';
import {
  returnCurrentPlayer,
  returnCurrentRoom,
} from '../helpers/returnCurrent';

export const addUserToRoom = (
  msg: IServerMessage,
  ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as IncomingData;
  const roomId = data.indexRoom;
  const curentRoom = returnCurrentRoom(roomId);
  const curentPlayer = returnCurrentPlayer(ws.id);

  if (!curentPlayer || !curentRoom || curentRoom.roomUsers.length !== 1) return;
  if (curentRoom.roomUsers[0].index === curentPlayer.index)
    return print('User try add himself in his room', 'red');

  curentRoom.roomUsers.push(curentPlayer);
  DB.updateRoom(curentRoom);
  updateRoom(msg, ws, wss);
  createGame(curentRoom, curentPlayer, wss);
};

type IncomingData = {
  indexRoom: number;
};
