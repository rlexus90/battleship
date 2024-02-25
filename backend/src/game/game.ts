import { Player } from '../types/IGame';

export class Game {
  private playerOne: Player;
  private playerTwo: Player;

  constructor(players: Player[]) {
    this.playerOne = players[0];
    this.playerTwo = players[1];
  }
}
