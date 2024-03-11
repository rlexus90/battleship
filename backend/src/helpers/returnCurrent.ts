import { DB } from '../dataBase/dataBase';
import { IGame } from '../types/IGame';

export const returnCurrentPlayer = (id: string) => {
  const [currentPlayer] = DB.players.filter((player) => player.id === id);
  return currentPlayer || undefined;
};

export const returnCurrentRoom = (id: number) => {
  const [curentRoom] = DB.rooms.filter((room) => room.roomId === id);
  return curentRoom || undefined;
};

export const returnCurrentGame = (id: number) => {
  const [currentGame] = DB.games.filter((game) => game.idGame === id);
  return currentGame || undefined;
};

export const curentPlayerFromGame = (id: string, game: IGame) => {
  const [curentPlayer] = game.players.filter((player) => player.id === id);
  return curentPlayer || undefined;
};
