import { WebSocketServer } from 'ws';
import { Cell } from './fiilBattlefield';
import { print } from './print';
import { AnswerAttackData, EnumTypes } from '../types/iServerMsg';
import { WebSocketId } from '../types/webSocket';
import { sendMessage } from './sendMessage';

export const openCells = (
  field: Cell[][],
  x: number,
  y: number,
  wss: WebSocketServer,
  player: number,
  id: string[],
) => {
  try {
    const dataArr: AnswerAttackData[] = [];
    dataArr.push({
      position: { x, y },
      currentPlayer: player,
      status: 'killed',
    });

    const openNeighbor = (x: number, y: number) => {
      if (y > 0) {
        if (field[y - 1][x] === 'bang') {
          field[y - 1][x] = 'kill';
          dataArr.push({
            position: { x, y: y - 1 },
            currentPlayer: player,
            status: 'killed',
          });
          openNeighbor(x, y - 1);
        } else {
          field[y - 1][x] = 'x';
          dataArr.push({
            position: { x, y: y - 1 },
            currentPlayer: player,
            status: 'miss',
          });

          if (x - 1 >= 0) {
            field[y - 1][x - 1] = 'x';
            dataArr.push({
              position: { x: x - 1, y: y - 1 },
              currentPlayer: player,
              status: 'miss',
            });
          }
          if (x + 1 <= 9) {
            field[y - 1][x + 1] = 'x';
            dataArr.push({
              position: { x: x + 1, y: y - 1 },
              currentPlayer: player,
              status: 'miss',
            });
          }
        }
      }

      if (y < 9) {
        if (field[y + 1][x] === 'bang') {
          field[y + 1][x] = 'kill';
          dataArr.push({
            position: { x, y: y + 1 },
            currentPlayer: player,
            status: 'killed',
          });
          openNeighbor(x, y + 1);
        } else {
          field[y + 1][x] = 'x';
          dataArr.push({
            position: { x, y: y + 1 },
            currentPlayer: player,
            status: 'miss',
          });

          if (x - 1 >= 0) {
            field[y + 1][x - 1] = 'x';
            dataArr.push({
              position: { x: x - 1, y: y + 1 },
              currentPlayer: player,
              status: 'miss',
            });
          }
          if (x + 1 <= 9) {
            field[y + 1][x + 1] = 'x';
            dataArr.push({
              position: { x: x + 1, y: y + 1 },
              currentPlayer: player,
              status: 'miss',
            });
          }
        }
      }

      if (x > 0) {
        if (field[y][x - 1] === 'bang') {
          field[y][x - 1] = 'kill';
          dataArr.push({
            position: { x: x - 1, y },
            currentPlayer: player,
            status: 'killed',
          });
          openNeighbor(x - 1, y);
        } else {
          field[y][x - 1] = 'x';
          dataArr.push({
            position: { x: x - 1, y },
            currentPlayer: player,
            status: 'miss',
          });
        }
      }

      if (x < 9) {
        if (field[y][x + 1] === 'bang') {
          field[y][x + 1] = 'kill';
          dataArr.push({
            position: { x: x + 1, y },
            currentPlayer: player,
            status: 'killed',
          });
          openNeighbor(x + 1, y);
        } else {
          field[y][x + 1] = 'x';
          dataArr.push({
            position: { x: x + 1, y },
            currentPlayer: player,
            status: 'miss',
          });
        }
      }
    };

    openNeighbor(x, y);

    dataArr.sort((data) => (data.status === 'killed' ? 1 : -1));

    dataArr.forEach((data) => {
      wss.clients.forEach((client: WebSocketId) => {
        if (id.some((id) => client.id === id))
          sendMessage(client, EnumTypes.attack, data);
      });
    });
  } catch {
    print('Some went wrong', 'red');
  }
};
