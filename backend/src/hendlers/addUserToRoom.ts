import { WebSocketServer } from 'ws';
import { IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { updateRoom } from './updateRoom';

export const addUserToRoom = (
  msg: IServerMessage,
  ws: WebSocketId,
  _wss: WebSocketServer,
) => {
  const data = JSON.parse(msg.data) as IncomingData;
  const roomId = data.indexRoom;
  const [curentRoom] = DB.rooms.filter((room) => room.roomId === roomId);
  const [curentPlayer] = DB.players.filter((player) => player.id === ws.id);

  if (!curentPlayer || !curentRoom || curentRoom.roomUsers.length !== 1) return;
  curentRoom.roomUsers.push(curentPlayer);
  DB.updateRoom(curentRoom);
  updateRoom(msg, ws, _wss);
};

type IncomingData = {
  indexRoom: number;
};
