import { Server, WebSocketServer } from 'ws';
import { print } from './helpers/print';
import { getMessage } from './messages/getMessage';

const PORT = 3000;

export class App {
  private server: WebSocketServer;

  public serverRun() {
    this.server = new Server({ port: PORT }, () =>
      print(`WebSocket Server start on port ${PORT}`, 'default'),
    );

    this.server.on('close', () => print('\nServer is down\n', 'default'));

    this.server.on('connection', (ws) => {
      print(`New conection  `, 'yellow');
      print(`Number conections - ${this.server.clients.size}`, 'yellow');

      ws.on('message', (msg) => {
        getMessage(
          JSON.parse(msg.toString()),
          ws as unknown as WebSocket,
          this.server,
        );
      });
    });
  }

  public serverDown() {
    this.server.close();
  }
}
