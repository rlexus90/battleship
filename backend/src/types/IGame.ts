import { Game } from '../game/Game';

export interface IGame {
  idGame: number;
  players: Player[];
  gameSesion?: Game;
}

export interface Player {
  index: number;
  ships?: Ship[];
  id: string;
  kills?: number;
}

export type Ship = {
  isBot?: boolean;
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};
