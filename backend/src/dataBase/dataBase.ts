import { IPlayer } from '../types/player';
import { IRoom } from '../types/room';

export class DB {
  static players: IPlayer[] = [];
  static rooms: IRoom[] = [];

  static updatePlayer(player: IPlayer) {
    const index = this.players.findIndex((el) => el.index === player.index);
    this.players[index] = { ...this.players[index], ...player };
  }

  static pushPlayer(palayer: IPlayer) {
    this.players.push(palayer);
  }

  static pushRoom(room: IRoom) {
    this.rooms.push(room);
  }
}
