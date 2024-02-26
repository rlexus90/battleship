import { Server, WebSocketServer } from 'ws';
import { print } from './helpers/print';
import { getMessage } from './messages/getMessage';
import { WebSocketId } from './types/webSocket';
import { returnCurrentPlayer } from './helpers/returnCurrent';
import { DB } from './dataBase/dataBase';
import { updateWiners } from './helpers/updateWiners';
import { AnswerFinishData, EnumTypes } from './types/iServerMsg';
import { sendMessage } from './helpers/sendMessage';

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

      ws.on('close', () => {
        print('Conection fallen', 'red');
        const [game] = DB.games.filter((game) =>
          game.players.some((player) => player.id === ws.id),
        );
        if (!game) return;

        const [player] = game.players.filter((player) => player.id !== ws.id);

        const winner = returnCurrentPlayer(player.id);
        winner.wins += 1;
        const data: AnswerFinishData = {
          winPlayer: winner.index,
        };
        try {
          this.server.clients.forEach((client: WebSocketId) => {
            if (client.id === winner.id)
              sendMessage(client, EnumTypes.finish, data);
          });
        } catch {
          print('Some went wrong', 'red');
        }
        updateWiners(this.server);
        DB.deleteGame(game.idGame);
        DB.deleteRoom(game.idGame);
      });
    });
  }

  public serverDown() {
    this.server.close();
  }
}
