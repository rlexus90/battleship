import { AddShipsData } from '../hendlers/addShips';
import { IGame } from '../types/game';
import { IPlayer } from '../types/player';
import { IRoom } from '../types/room';

export class DB {
  static players: IPlayer[] = [];
  static rooms: IRoom[] = [];
  static games: IGame[] = [];

  static updatePlayer(player: IPlayer) {
    const index = this.players.findIndex((el) => el.index === player.index);
    this.players[index] = { ...this.players[index], ...player };
  }

  static updateRoom(room: IRoom) {
    const index = this.rooms.findIndex((el) => el.roomId === room.roomId);
    this.rooms[index] = { ...this.rooms[index], ...room };
  }

  static updateGame(game: IGame) {
    const index = this.games.findIndex((el) => el.idGame === game.idGame);
    this.games[index] = { ...this.games[index], ...game };
  }

  static updatePlayerShips(data: AddShipsData) {
    const gameIndex = this.games.findIndex((el) => el.idGame === data.gameId);
    const playerIndex = this.games[gameIndex].players.findIndex(
      (el) => el.index === data.indexPlayer,
    );
    if (gameIndex === -1 || playerIndex === -1) return false;
    this.games[gameIndex].players[playerIndex].ships = data.ships;
    return true;
  }

  static pushPlayer(palayer: IPlayer) {
    this.players.push(palayer);
  }

  static pushRoom(room: IRoom) {
    this.rooms.push(room);
  }

  static pushGame(game: IGame) {
    this.games.push(game);
  }
}
