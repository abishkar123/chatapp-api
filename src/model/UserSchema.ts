import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);

// src/models/Message.ts
export interface IMessage extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  roomId?: string;
}

const MessageSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  roomId: { 
    type: String, 
    default: 'general' 
  }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);