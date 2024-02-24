import { WebSocketServer } from 'ws';
import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { DB } from '../dataBase/dataBase';
import { sendMessage } from '../helpers/sendMessage';
import { print } from '../helpers/print';

export const updateRoom = (
  _msg: IServerMessage,
  _ws: WebSocketId,
  wss: WebSocketServer,
) => {
  const rooms = DB.rooms;
  const data = rooms.filter((room) => room.roomUsers.length === 1);

  try {
    wss.clients.forEach((client: WebSocketId) =>
      sendMessage(client, EnumTypes.update_room, data),
    );
  } catch {
    print('Some went wrong', 'red');
  }
};
