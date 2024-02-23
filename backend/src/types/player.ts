export interface IPlayer {
  name: string;
  index: number;
  error?: boolean;
  errorText?: string;
  password: string;
  wins?: number;
}
