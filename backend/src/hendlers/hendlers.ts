import { EnumTypes } from '../types/iServerMsg';
import { addShips } from './addShips';
import { addUserToRoom } from './addUserToRoom';
import { attack } from './attack';
import { createRoom } from './createRoom';
import { randomAttack } from './randomAttack';
import { registration } from './registration';

export const hendlers = new Map([
  [EnumTypes.reg as string, registration],
  [EnumTypes.create_room as string, createRoom],
  [EnumTypes.add_user_to_room as string, addUserToRoom],
  [EnumTypes.add_ships as string, addShips],
  [EnumTypes.attack as string, attack],
  [EnumTypes.randomAttack as string, randomAttack],
]);
