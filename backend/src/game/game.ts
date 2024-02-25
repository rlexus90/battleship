import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';

export class Game {
  wss: WebSocketServer;
  private playerOne: Player;
  private playerTwo: Player;

  constructor(players: Player[], wss: WebSocketServer) {
    this.playerOne = players[0];
    this.playerTwo = players[1];
    this.wss = wss;
    console.log(this.playerOne.ships);
  }
}
