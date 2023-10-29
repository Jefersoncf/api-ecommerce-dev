import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        // console.log(user);
        req.user = user;
        next();
      }
    } catch (error) {
      console.log(error);
      throw new Error("Não autorizado, token falhou. Faça login novamente");
    }
  } else {
    throw new Error("Não tem token de autorização no header");
  }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  // console.log(email);
  try {
    const admin = await User.findOne({ email });
    if (admin.role !== "admin") {
      throw new Error("Não autorizado como administrador");
    } else {
      next();
    }
  } catch (error) {
    // console.log(error);
    throw new Error("O ID do usuario não esta valido.", error.message);
  }
});
