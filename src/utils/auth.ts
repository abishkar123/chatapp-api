import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export function generateToken(username: string) {
   return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
   try {
      return jwt.verify(token, SECRET_KEY);
   } catch (err) {
      return null;
   }
}
