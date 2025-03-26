import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { initWebSocket } from './src/websocket/server'

const app = express();
const server = http.createServer(app);

import { connectDB } from './src/db/dbconfig';
connectDB();


const io = initWebSocket(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});