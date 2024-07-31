import { Router } from "express";
import userRouter from "./users.mjs";
import { loggingMiddleware } from "../utils/middlewares.mjs";
import productRouter from "./products.mjs";

const router = Router();

router.use(loggingMiddleware);

router.use(userRouter);
router.use(productRouter);

export default router;
