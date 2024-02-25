import { WebSocketServer } from 'ws';
import { Player } from '../types/IGame';
import { turn } from '../helpers/turn';
import { Cell, fillBattlefield } from '../helpers/fiilBattlefield';
import {
  AnswerAttackData,
  AnswerFinishData,
  EnumTypes,
} from '../types/iServerMsg';
import { print } from '../helpers/print';
import { sendMessage } from '../helpers/sendMessage';
import { WebSocketId } from '../types/webSocket';
import { openCells } from '../helpers/openCells';
import { checkKilled } from '../helpers/checkKilled';
import { deleteGame } from '../helpers/deleteGame';

export class Game {
  wss: WebSocketServer;
  private playerOne: Player;
  private playerTwo: Player;
  private currentTurn: number;
  private battlefieldOne: Cell[][];
  private battlefieldTwo: Cell[][];
  private gameIndex: number;

  constructor(players: Player[], gameIndex: number, wss: WebSocketServer) {
    this.playerOne = players[0];
    this.playerTwo = players[1];
    this.playerOne.kills = 0;
    this.playerTwo.kills = 0;
    this.wss = wss;
    this.gameIndex = gameIndex;
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

  private incressKills() {
    const curentPlayer =
      this.currentTurn === this.playerOne.index
        ? this.playerOne
        : this.playerTwo;

    curentPlayer.kills += 1;
    if (curentPlayer.kills === 10) return this.gameOver(curentPlayer);
  }

  private gameOver(player: Player) {
    const data: AnswerFinishData = {
      winPlayer: player.index,
    };

    try {
      this.wss.clients.forEach((client: WebSocketId) => {
        if (client.id === this.playerOne.id || client.id === this.playerTwo.id)
          sendMessage(client, EnumTypes.finish, data);
      });
    } catch {
      print('Some went wrong', 'red');
    }
    deleteGame(this.gameIndex, player, this.wss);
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
    if (currentField[y][x] === 1) {
      currentField[y][x] = 'kill';
      openCells(currentField, x, y, this.wss, this.currentTurn, [
        this.playerOne.id,
        this.playerTwo.id,
      ]);
      this.incressKills();
      this.turn();
      return;
    }

    const isKiled = checkKilled(currentField, x, y);

    if (isKiled) {
      currentField[y][x] = 'kill';
      openCells(currentField, x, y, this.wss, this.currentTurn, [
        this.playerOne.id,
        this.playerTwo.id,
      ]);
      this.incressKills();
      this.turn();
    } else {
      currentField[y][x] = 'bang';
      const data: AnswerAttackData = {
        position: { x, y },
        currentPlayer: this.currentTurn,
        status: 'shot',
      };

      try {
        this.wss.clients.forEach((client: WebSocketId) => {
          if (
            client.id === this.playerOne.id ||
            client.id === this.playerTwo.id
          )
            sendMessage(client, EnumTypes.attack, data);
        });

        this.turn();
      } catch {
        print('Some went wrong', 'red');
      }
    }
  }

  public randomAttack(playerIndex: number): void {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    const currentField =
      playerIndex === this.playerTwo.index
        ? this.battlefieldOne
        : this.battlefieldTwo;

    if (
      currentField[y][x] === 'bang' ||
      currentField[y][x] === 'kill' ||
      currentField[y][x] === 'x'
    )
      return this.randomAttack(playerIndex);

    this.shoot(playerIndex, x, y);
  }
}
