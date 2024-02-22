import ws, { WebSocketServer } from 'ws';

const PORT = 3000;

export class App {
  private server: WebSocketServer;

  public serverRun() {
    this.server = new ws.Server({ port: PORT }, () =>
      console.log(`Server start on port ${PORT}`),
    );
  }
}
