import { App } from './backend/src/app';
import { downApp } from './backend/src/helpers/shotDownApp';
import { httpServer } from './backend';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const app = new App();
app.serverRun();

downApp(app);
