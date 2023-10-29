import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controller/blog_category.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);
router.get("/:id", getCategoryById);
router.get("/all", getAllCategories);

export default router;
