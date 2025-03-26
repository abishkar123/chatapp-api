import express from 'express'
import Message from '../model/Message';

const router = express.Router()

router.get("/messages", async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
    res.json(messages);
 });

 export default router;