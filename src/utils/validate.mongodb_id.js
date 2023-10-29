import mongoose from "mongoose";

export const validateMongoDBId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("ID inválido ou não encontrado");
  }
};
