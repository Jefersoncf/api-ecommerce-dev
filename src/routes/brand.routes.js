import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../controller/brand.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/new", authMiddleware, adminMiddleware, createBrand);
router.put("/:id", authMiddleware, adminMiddleware, updateBrand);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBrand);
router.get("/:id", getBrandById);
router.get("/all", getAllBrands);

export default router;
