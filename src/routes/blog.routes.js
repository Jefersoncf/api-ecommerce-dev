import express from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  dislikeTheBlog,
  getAllBlogs,
  getOneBlog,
  likeTheBlog,
  updateBlog,
} from "../controller/blog.controller.js";

const router = express.Router();

router.post("/new", authMiddleware, adminMiddleware, createBlog);
router.put("/likes", authMiddleware, likeTheBlog);
router.put("/dislikes", authMiddleware, dislikeTheBlog);
router.put("/update/:id", authMiddleware, adminMiddleware, updateBlog);
router.get("/:id", getOneBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);

export default router;
