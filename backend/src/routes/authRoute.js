import express from "express";
import {
  refreshToken,
  signUp,
  signIn,
  signOut,
} from "../controllers/authController.js";

const router = express.Router();

//signup API
router.post("/signup", signUp);

//signin API
router.post("/signin", signIn);

//signout API
router.post("/signout", signOut);

//refresh token API
router.get("/refresh", refreshToken);
router.post("/refresh", refreshToken);

export default router;
