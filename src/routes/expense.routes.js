import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createNewExpense, getAnExpense, getOverAllExpense, downloadSheet } from "../controllers/expense.controller.js";
import { validateExpense } from "../middlewares/expense.middle.js";

const router = express.Router();

router.post('/', protectRoute, validateExpense, createNewExpense);
router.get("/:id", protectRoute, getAnExpense);
router.get("/overall", protectRoute, getOverAllExpense);
router.get('/balance-sheet/download/:id', protectRoute, downloadSheet);

export default router



