import { Cell } from './fiilBattlefield';

export const checkKilled = (field: Cell[][], x: number, y: number) => {
  const sheepSize = field[y][x];
  const x1 = x - 1 >= 0 ? x - 1 : 0;
  const x2 = x + 1 <= 9 ? x + 1 : 9;
  if (
    field[y][x1] === 'bang' ||
    field[y][x1] === sheepSize ||
    field[y][x2] === 'bang' ||
    field[y][x2] === sheepSize
  ) {
    field[y][x] = 'bang';
    if (goLeft(field, x, y) === false || goRight(field, x, y) === false)
      return false;
    return true;
  }
  field[y][x] = 'bang';
  if (goUp(field, x, y) === false || goDown(field, x, y) === false)
    return false;
  return true;
};

const goUp = (field: Cell[][], x: number, y: number): boolean => {
  if (y === 0) return true;

  if (field[y - 1][x] === 'x' || field[y - 1][x] === 0) return true;

  if (field[y - 1][x] === 'bang') return goUp(field, x, y - 1);
  return false;
};

const goDown = (field: Cell[][], x: number, y: number): boolean => {
  if (y === 9) return true;

  if (field[y + 1][x] === 'x' || field[y + 1][x] === 0) return true;

  if (field[y + 1][x] === 'bang') return goDown(field, x, y + 1);
  return false;
};

const goLeft = (field: Cell[][], x: number, y: number): boolean => {
  if (x === 0) return true;

  if (field[y][x - 1] === 'x' || field[y][x - 1] === 0) return true;

  if (field[y][x - 1] === 'bang') return goLeft(field, x - 1, y);
  return false;
};

const goRight = (field: Cell[][], x: number, y: number): boolean => {
  if (x === 9) return true;

  if (field[y][x + 1] === 'x' || field[y][x + 1] === 0) return true;

  if (field[y][x + 1] === 'bang') return goRight(field, x + 1, y);
  return false;
};
