import { Game } from '../game/game';

export interface IGame {
  idGame: number;
  players: Player[];
  gameSesion?: Game;
}

export interface Player {
  index: number;
  ships?: Ship[];
  id: string;
}

export type Ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};
