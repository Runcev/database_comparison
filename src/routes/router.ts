import express from "express";
import { productsSoldAmount } from "./controllers";

const router = express.Router();

router.get("/productsSoldAmount", productsSoldAmount);

export default router;
