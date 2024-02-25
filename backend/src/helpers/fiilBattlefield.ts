import { Ship } from '../types/IGame';

export const fillBattlefield = (ships: Ship[]) => {
  const battlefield: Cell[][] = [];

  for (let i = 0; i < 10; i++) {
    battlefield[i] = Array(10).fill(0);
  }

  ships.forEach((ship) => {
    const { length, position, direction } = ship;
    const { x, y } = position;

    if (direction) {
      for (let i = 0; i < length; i++) {
        battlefield[y + i][x] = length;
      }
    } else {
      for (let i = 0; i < length; i++) {
        battlefield[y][x + i] = length;
      }
    }
  });
  return battlefield;
};

export type Cell = number | 'x' | 'bang';
