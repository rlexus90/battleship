import { EnumTypes } from '../types/iServerMsg';
import { createRoom } from './createRoom';
import { registration } from './registration';

export const hendlers = new Map([
  [EnumTypes.reg as string, registration],
  [EnumTypes.create_room as string, createRoom],
]);
