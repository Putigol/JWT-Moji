import express from "express";
import { authMe, test } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);

//Đảm bảo phải có access token
router.get("/test", test);

export default router;
