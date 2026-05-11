import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket connection handling
io.on('connection', (socket: any) => {
  logger.info(`New client connected: ${socket.id}`);
  
  socket.on('join-live', (videoId: string) => {
    socket.join(`live-${videoId}`);
    const viewerCount = io.sockets.adapter.rooms.get(`live-${videoId}`)?.size || 0;
    io.to(`live-${videoId}`).emit('viewer-count', viewerCount);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room: string) => {
      if (room.startsWith('live-')) {
        const currentCount = io.sockets.adapter.rooms.get(room)?.size || 0;
        io.to(room).emit('viewer-count', Math.max(0, currentCount - 1));
      }
    });
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
