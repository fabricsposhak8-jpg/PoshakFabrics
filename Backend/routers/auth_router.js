import express from "express";
import { register, login, AdminGetAllUsers, GetAllUsers, googleLogin, ProfileUpdate } from "../controllers/auth_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { admin_Middleware } from "../middlewares/admin_middleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all-users", authMiddleware, admin_Middleware, AdminGetAllUsers);
router.get("/users", GetAllUsers)
router.post("/google-login", googleLogin);
router.put("/profile", authMiddleware, upload.array("files", 1), ProfileUpdate);



export default router;