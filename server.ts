import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import Message from "./src/model/Message";
import { connectDB } from "./src/db/dbconfig";
import { verifyToken } from "./src/utils/auth";

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());4



connectDB()

wss.on("connection", (ws, req) => {
   const token = req.url?.split("token=")[1];
   const user = verifyToken(token);
   if (!user) return ws.close();

   ws.on("message", async (data) => {
      const { message } = JSON.parse(data.toString());
      const newMessage = await Message.create({ username: user.username, message });

      wss.clients.forEach(client => {
         if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(newMessage));
         }
      });
   });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
