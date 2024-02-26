import { EnumTypes, IServerMessage } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import ws, { WebSocketServer } from 'ws';
import { BOT_INIT_DATA } from './botMesages';
import { sendMessage } from '../helpers/sendMessage';
import { DB } from '../dataBase/dataBase';
import { returnCurrentPlayer } from '../helpers/returnCurrent';
import { IRoom } from '../types/room';
import { IGame } from '../types/IGame';
import { IPlayer } from '../types/player';
import { AddShipsData } from '../hendlers/addShips';
import { print } from '../helpers/print';

export class Bot {
  ws: WebSocketId;
  wss: WebSocketServer;
  bot: IPlayer;
  player: IPlayer;
  game: IGame;
  public botId: number;

  constructor(playerId: string, wss: WebSocketServer) {
    this.ws = new ws('ws://localhost:3000/') as WebSocketId;
    this.wss = wss;
    this.player = returnCurrentPlayer(playerId);
    this.ws.on('open', () =>
      sendMessage(this.ws as WebSocketId, EnumTypes.reg, BOT_INIT_DATA),
    );

    this.ws.on('message', (msg: string) => this.handleMessage(JSON.parse(msg)));
  }

  private handleMessage(msg: IServerMessage) {
    const { type, data } = msg;

    switch (type) {
      case EnumTypes.reg:
        return this.startGame();
      case EnumTypes.turn:
        return this.attack(data as unknown as TurnInfo);
      case EnumTypes.finish:
        return this.endGame();
    }
  }

  endGame() {
    this.ws.close();
    DB.deleteBot(this.botId);
  }

  startGame() {
    this.findBot();
    this.createRoom();
    this.botId = this.bot.index;
  }

  createRoom() {
    if (!this.player) return;

    const room: IRoom = {
      roomId: Date.now(),
      roomUsers: [
        { name: this.player.name, index: this.player.index },
        { name: this.bot.name, index: this.bot.index },
      ],
    };
    DB.pushRoom(room);
    this.createGame(room.roomId);
  }

  createGame(roomId: number) {
    this.game = {
      idGame: roomId,
      players: [
        { index: this.player.index, id: this.player.id },
        {
          index: this.bot.index,
          id: this.bot.id,
        },
      ],
    };

    DB.pushGame(this.game);
    this.addShips();
  }

  addShips() {
    const data: AddShipsData = {
      gameId: this.game.idGame,
      indexPlayer: this.bot.index,
      ships: [
        {
          isBot: true,
          position: { x: 0, y: 0 },
          direction: true,
          length: 1,
          type: 'small',
        },
      ],
    };
    const ifShipsUpdated = DB.updatePlayerShips(data);
    if (ifShipsUpdated) print('Bot ready', 'green');

    try {
      this.wss.clients.forEach((client: WebSocketId) => {
        if (client.id !== this.player.id) return;

        const message: MessageStartGame = {
          idGame: this.game.idGame,
          idPlayer: this.player.index,
        };
        sendMessage(client, EnumTypes.create_game, message);
      });
    } catch {
      print('Some went wrong', 'red');
    }
  }

  findBot() {
    const [bot] = DB.players.filter((player) => player.name === 'Bot');
    if (bot) this.bot = bot;
  }

  attack(data: TurnInfo) {
    if (data.currentPlayer === this.player.index) return;
    const attack: RandomAttack = {
      gameId: this.game.idGame,
      indexPlayer: this.bot.index,
    };
    sendMessage(this.ws, EnumTypes.randomAttack, attack);
  }
}

type MessageStartGame = {
  idGame: number;
  idPlayer: number;
};

type TurnInfo = {
  currentPlayer: number;
};

type RandomAttack = {
  gameId: number;
  indexPlayer: number;
};
