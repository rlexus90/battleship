export interface IRoom {
  roomId: number;
  roomUsers: User[];
}

type User = {
  name: string;
  index: number;
};
