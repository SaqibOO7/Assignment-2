import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createUser, getUserDetail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", protectRoute, createUser);           //creating new User
router.get("/:id", protectRoute, getUserDetail);      //geting an individual user

export default router