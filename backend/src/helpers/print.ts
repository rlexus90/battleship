type Color = 'green' | 'yellow' | 'red' | 'default';

export const print = (str: string, color: Color) => {
  switch (color) {
    case 'green':
      process.stdout.write('\x1b[32m' + str + '\x1b[0m' + '\n');
      break;
    case 'yellow':
      process.stdout.write('\x1b[33m' + str + '\x1b[0m' + '\n');
      break;
    case 'red':
      process.stdout.write('\x1b[31m' + str + '\x1b[0m' + '\n');
      break;
    case 'default':
      process.stdout.write(str + '\n');
      break;
  }
};
