import express from "express";
import { signUp, signIn, signOut } from "../controllers/authController.js";

const router = express.Router();

//signup API
router.post("/signup", signUp);

//signin API
router.post("/signin", signIn);

//signout API
router.post("/signout", signOut);

export default router;
