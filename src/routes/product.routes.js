import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  rating,
  updateProduct,
} from "../controller/product.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new", authMiddleware, adminMiddleware, createProduct);
router.get("/:id", getOneProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.get("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.get("/", getAllProducts);

export default router;
