import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';
import { turn } from '../helpers/turn';

export class Game {
  wss: WebSocketServer;
  private playerOne: Player;
  private playerTwo: Player;
  private currentTurn: number;

  constructor(players: Player[], wss: WebSocketServer) {
    this.playerOne = players[0];
    this.playerTwo = players[1];
    this.wss = wss;
    this.currentTurn = this.playerOne.index;
    console.log(this.playerOne.ships);
  }

  public turn() {
    turn(this.playerOne, this.playerTwo, this.currentTurn, this.wss);
  }
}
