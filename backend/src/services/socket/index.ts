import io, { Socket } from 'socket.io';
import server from '../../app';

const ioserver = new io.Server(server)

ioserver.on('connection', (socket: Socket) => {
    console.log('Connection', socket);
});


export default ioserver
