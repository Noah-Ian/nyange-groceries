import {Router} from "express";
import {authenticate} from "../middleware/auth.middleware.js";
import {requireAdmin} from "../middleware/admin.middleware.js";
import {create} from "../controllers/product.controller.js";

const router = Router();

router.post("/", authenticate,requireAdmin,create);

export default router;