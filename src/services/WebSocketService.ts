import io, { Socket } from 'socket.io-client';


class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io('http://localhost:8000', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  joinRoom(roomId: string = 'general') {
    this.socket?.emit('join_room', roomId);
  }

  sendMessage(content: string, roomId: string = 'general') {
    this.socket?.emit('send_message', { content, roomId });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  onPreviousMessages(callback: (messages: any[]) => void) {
    this.socket?.on('previous_messages', callback);
  }

  typingIndicator(roomId: string = 'general') {
    this.socket?.emit('typing', roomId);
  }
}

export default new WebSocketService();