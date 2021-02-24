import io, { Socket } from 'socket.io';
import { createServer } from 'http';
import app from './server';
import sequelize  from '@db/index';
import config from "@config/index";

(async () => {

  const server = createServer(app.callback()).listen(config.server.port, async () => {
    console.log(`Server listen on port ${config.server.port}`);
  });

  const ioserver = new io.Server(server)

  ioserver.on('connection', (socket: Socket) => {
      console.log('Connection', socket);
  });

})();