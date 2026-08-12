import express from "express";
import { checkFriendship } from "../middlewares/friendMiddleware.js";

import { sendDirectMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/direct", checkFriendship, sendDirectMessage);

export default router;
