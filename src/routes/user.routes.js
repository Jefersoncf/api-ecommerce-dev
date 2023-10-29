import express from "express";
import {
  blockUser,
  createUser,
  deleteUser,
  forgotPasswordToken,
  getUserById,
  getUsers,
  handleRefreshToken,
  loginUser,
  logoutUser,
  resetPassword,
  unblockUser,
  updatePassword,
  updateUser,
} from "../controller/user.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/up-password", authMiddleware, updatePassword);

router.post("/login", loginUser);
router.get("/all-users", getUsers);
router.get("/refresh", handleRefreshToken);
router.get("/user/:id", authMiddleware, adminMiddleware, getUserById);
router.put("/user/:id", authMiddleware, updateUser);
router.put("/block/:id", authMiddleware, adminMiddleware, blockUser);
router.put("/unblock/:id", authMiddleware, adminMiddleware, unblockUser);
router.delete("/user/:id", deleteUser);
router.get("/logout", logoutUser);

export default router;
