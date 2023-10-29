import BlogCategory from "../models/blog_category.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validate.mongodb_id.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.json({ msg: "Categoria criada com sucesso", newCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BlogCategory.find();

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const category = await BlogCategory.findById(id);

    res.json({ category });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ msg: "Categoria atualizada com sucesso", updatedCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const deletedCategory = await BlogCategory.findByIdAndDelete(id);

    res.json({ msg: "Categoria deletada com sucesso", deletedCategory });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
