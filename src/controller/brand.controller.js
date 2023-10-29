import Brand from "../models/brand.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validate.mongodb_id.js";

export const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({ msg: "Brand criada com sucesso", newBrand });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();

    res.json({ brands });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const brand = await Brand.findById(id);

    res.json({ brand });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ msg: "Brand atualizada com sucesso", updatedBrand });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);

    res.json({ msg: "Brand deletada com sucesso", deletedBrand });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
