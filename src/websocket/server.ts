import { Server } from 'socket.io';
import { AuthService } from '../services/AuthService';
import { MessageService } from '../services/MessageService';


export function initWebSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = AuthService.verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room
    socket.on('join_room', async (roomId = 'general') => {
      socket.join(roomId);
      
      try {
        // Fetch recent messages
        const messages = await MessageService.getRecentMessages(roomId);
        socket.emit('previous_messages', messages);
      } catch (error) {
        socket.emit('error', 'Failed to fetch messages');
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { roomId, content } = data;
        const message = await MessageService.sendMessage(
          socket.data.user.id, 
          content, 
          roomId
        );

        // Broadcast to room
        io.to(roomId).emit('new_message', {
          user: socket.data.user.username,
          content: message.content,
          timestamp: message.timestamp
        });
      } catch (error) {
        socket.emit('error', 'Failed to send message');
      }
    });

    // Typing indicator
    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('user_typing', {
        username: socket.data.user.username
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}