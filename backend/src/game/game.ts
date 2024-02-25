import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';
import { turn } from '../helpers/turn';
import { Cell, fillBattlefield } from '../helpers/fiilBattlefield';
import { AnswerAttackData, EnumTypes } from '../types/iServerMsg';
import { print } from '../helpers/print';
import { sendMessage } from '../helpers/sendMessage';
import { WebSocketId } from '../types/webSocket';

export class Game {
  wss: WebSocketServer;
  private playerOne: Player;
  private playerTwo: Player;
  private currentTurn: number;
  private battlefieldOne: Cell[][];
  private battlefieldTwo: Cell[][];

  constructor(players: Player[], wss: WebSocketServer) {
    this.playerOne = players[0];
    this.playerTwo = players[1];
    this.wss = wss;
    this.currentTurn = this.playerOne.index;
    this.battlefieldOne = fillBattlefield(this.playerOne.ships);
    this.battlefieldTwo = fillBattlefield(this.playerTwo.ships);
  }

  public turn() {
    turn(this.playerOne, this.playerTwo, this.currentTurn, this.wss);
  }

  private changeTurn() {
    this.currentTurn =
      this.currentTurn === this.playerOne.index
        ? this.playerTwo.index
        : this.playerOne.index;

    this.turn();
  }

  public shoot(playerIndex: number, x: number, y: number) {
    if (playerIndex !== this.currentTurn) return;
    this.checkShoot(x, y);
  }

  private checkShoot(x: number, y: number) {
    const currentField =
      this.currentTurn === this.playerTwo.index
        ? this.battlefieldOne
        : this.battlefieldTwo;

    switch (currentField[y][x]) {
      case 'x':
        return;
      case 'bang':
        return;
      case 0:
        return this.miss(currentField, x, y);
      default:
        return this.shot(currentField, x, y);
    }
  }

  private miss(currentField: Cell[][], x: number, y: number) {
    const data: AnswerAttackData = {
      position: { x, y },
      currentPlayer: this.currentTurn,
      status: 'miss',
    };

    try {
      this.wss.clients.forEach((client: WebSocketId) => {
        if (client.id === this.playerOne.id || client.id === this.playerTwo.id)
          sendMessage(client, EnumTypes.attack, data);
      });

      currentField[y][x] = 'x';
      this.changeTurn();
    } catch {
      print('Some went wrong', 'red');
    }
  }

  private shot(currentField: Cell[][], x: number, y: number) {
    console.log('shot');
  }
}
