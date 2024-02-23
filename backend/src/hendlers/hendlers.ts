import { EnumTypes } from '../types/iServerMsg';
import { registration } from './registration';

export const hendlers = new Map([
  [EnumTypes.reg as string, registration],
  [EnumTypes.add_ships, registration],
]);
