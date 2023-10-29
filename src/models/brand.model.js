import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Nome da brand é obrigatório",
      minlength: [2, "Nome da brand deve ter no mínimo 2 caracteres"],
      maxlength: [42, "Nome da brand deve ter no máximo 42 caracteres"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
