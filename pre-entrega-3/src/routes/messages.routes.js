import { Router } from "express"
import { messageController } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.get('/', messageController.getMessages);
messageRouter.post('/', messageController.createMessage);

export default messageRouter;