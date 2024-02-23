import { App } from './src/app';
import { downApp } from './src/helpers/shotDownApp';

const app = new App();
app.serverRun();

downApp(app);
