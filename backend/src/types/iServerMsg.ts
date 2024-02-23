export interface IServerMessage {
  type: string;
  data: string;
  id: 0;
}

export enum EnumTypes {
  'reg' = 'reg',
  'update_winners' = 'update_winners',
  'create_room' = 'create_room',
  'add_user_to_room' = 'add_user_to_room',
  'create_game' = 'create_game',
  'update_room' = 'update_room',
  'add_ships' = 'add_ships',
  'start_game' = 'start_game',
  'attack' = 'attack',
  'randomAttack' = 'randomAttack',
  'turn' = 'turn',
  'finish' = 'finish',
}
