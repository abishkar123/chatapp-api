import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/UserSchema';


export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

  static async registerUser(username: string, password: string) {
    try {

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already exists');
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        username,
        password: hashedPassword
      });

      await user.save();
      return this.generateToken(user);
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(username: string, password: string) {
    try {
      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      return this.generateToken(user);
    } catch (error) {
      throw error;
    }
  }

  private static generateToken(user: any) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username 
      }, 
      this.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}