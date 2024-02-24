import { Server, WebSocketServer } from 'ws';
import { print } from './helpers/print';
import { getMessage } from './messages/getMessage';
import { WebSocketId } from './types/webSocket';

const PORT = 3000;

export class App {
  private server: WebSocketServer;

  public serverRun() {
    this.server = new Server({ port: PORT }, () =>
      print(`WebSocket Server start on port ${PORT}`, 'default'),
    );

    this.server.on('close', () => print('\nServer is down\n', 'default'));

    this.server.on('connection', (ws: WebSocketId, reg) => {
      ws.id = reg.headers['sec-websocket-key'];
      print(`New conection  `, 'yellow');
      print(`Number conections - ${this.server.clients.size}`, 'yellow');

      ws.on('message', (msg) => {
        getMessage(JSON.parse(msg.toString()), ws, this.server);
      });
    });
  }

  public serverDown() {
    this.server.close();
  }
}
