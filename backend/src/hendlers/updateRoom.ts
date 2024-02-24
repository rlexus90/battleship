import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { IRoom } from '../types/room';
import { sendMessage } from '../helpers/sendMessage';

export const updateRoom = (
  _msg: IServerMessage,
  _ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const rooms = DB.rooms;
  const data = rooms.map<IRoom>((room) => {
    if (room.roomUsers.length === 1) return room;
  });

  wss.clients.forEach((client) =>
    sendMessage(client as WebSocketId, EnumTypes.update_room, data),
  );

  console.log(DB.rooms);
};
