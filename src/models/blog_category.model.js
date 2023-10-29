import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Nome da categoria é obrigatório",
      minlength: [2, "Nome da categoria deve ter no mínimo 2 caracteres"],
      maxlength: [42, "Nome da categoria deve ter no máximo 42 caracteres"],
      unique: true,
    },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default BlogCategory;
