import express from "express";

import { sendDirectMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/direct", sendDirectMessage);

export default router;
