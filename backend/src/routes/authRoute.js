import express from "express";
import { signUp, signIn } from "../controllers/authController.js";

const router = express.Router();

//signup API
router.post("/signup", signUp);

//signin API
router.post("/signin", signIn);
export default router;
