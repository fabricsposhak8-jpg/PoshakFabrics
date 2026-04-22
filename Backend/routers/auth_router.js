import express from "express";
import { register, login, AdminGetAllUsers, GetAllUsers, googleLogin } from "../controllers/auth_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", authMiddleware, admin_Middleware, AdminGetAllUsers);
router.get("/users", GetAllUsers)
router.post("/google-login", googleLogin);



export default router;