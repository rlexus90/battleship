import { Ship } from '../types/IGame';

export const fillBattlefield = (ships?: Ship[]) => {
  if (!ships) return randomField();

  const battlefield = emptyField();

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

const randomField = () => {
  const battlefield = emptyField();
  let i = 1;
  let size = 5 - i;

  while (size) {
    let count = i;

    while (count) {
      randomCell(battlefield, size);
      count--;
    }
    i++;
    size = 5 - i;
  }
  return battlefield;
};

const randomCell = (battlefield: Cell[][], size: number): void => {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  const gorizontal = Boolean(Math.floor(Math.random() * 2));

  if (!canAmply(battlefield, size, x, y, gorizontal))
    return randomCell(battlefield, size);

  if (gorizontal) {
    for (let i = 0; i < size; i++) {
      battlefield[y][x + i] = size;
    }
  } else {
    for (let i = 0; i < size; i++) {
      battlefield[y + i][x] = size;
    }
  }
};

const emptyField = () => {
  const battlefield: Cell[][] = [];
  for (let i = 0; i < 10; i++) {
    battlefield[i] = Array(10).fill(0);
  }
  return battlefield;
};

const canAmply = (
  battlefield: Cell[][],
  size: number,
  x: number,
  y: number,
  gorizontal: boolean,
): boolean => {
  const stack: Cell[] = [];

  if (gorizontal) {
    if (x + size - 1 > 9) return false;

    for (let i = -1; i <= size; i++) {
      y > 0 ? stack.push(battlefield[y - 1][x + i]) : null;
      stack.push(battlefield[y][x + i]);
      y < 9 ? stack.push(battlefield[y + 1][x + i]) : null;
    }
  } else {
    if (y + size - 1 > 9) return false;

    for (let i = -1; i <= size; i++) {
      if (y + i >= 0 && y + i <= 9) {
        stack.push(battlefield[y + i][x - 1]);
        stack.push(battlefield[y + i][x]);
        stack.push(battlefield[y + i][x + 1]);
      }
    }
  }
  return stack.every((cell): boolean => !cell);
};

export type Cell = number | 'x' | 'bang' | 'kill';
