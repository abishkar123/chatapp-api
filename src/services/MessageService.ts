import { Message } from "../model/UserSchema";
import { User } from "../model/UserSchema";

export class MessageService {
  static async sendMessage(userId: string, content: string, roomId: string = 'general') {
    try {
      const message = new Message({
        user: userId,
        content,
        roomId
      });

      await message.save();
      return message;
    } catch (error) {
      throw error;
    }
  }

  static async getRecentMessages(roomId: string = 'general', limit: number = 50) {
    try {
      const messages = await Message.find({ roomId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('user', 'username');

      return messages;
    } catch (error) {
      throw error;
    }
  }
}