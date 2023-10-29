import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model("Category", categorySchema);
export default Category;
