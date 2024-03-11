import { App } from '../app';

export const downApp = (app: App) => {
  process.on('SIGINT', async () => {
    app.serverDown();
    setTimeout(() => process.exit(), 100);
  });

  process.stdin.on('data', (data) => {
    const str = data.toString().trim();

    if (str === '.exit') {
      app.serverDown();
      setTimeout(() => process.exit(), 100);
    }
  });
};
