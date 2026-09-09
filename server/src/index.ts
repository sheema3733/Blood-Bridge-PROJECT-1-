import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app';
import { config } from './config';
import { initSocketServer } from './realtime/socketHandler';

const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new SocketIOServer(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

initSocketServer(io);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🩸 BloodBridge Real-Time Coordination Server`);
  console.log(`  🚀 Server running on: http://localhost:${PORT}`);
  console.log(`  🌐 WebSocket Active for Live Emergency Dispatch`);
  console.log(`  🔒 Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});
