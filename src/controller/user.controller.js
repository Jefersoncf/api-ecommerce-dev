import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwt.token.js";
import { validateMongoDBId } from "../utils/validate.mongodb_id.js";
import { generateRefreshToken } from "../config/refresh.token.js";
import { sendEmail } from "./email.controller.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", newUser });
  } else {
    throw new Error("Usuário já existe");
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    throw new Error("Erro ao buscar usuários", error);
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const userId = await User.findById(id);
    res.json(userId);
  } catch (error) {
    throw new Error("Erro ao buscar usuário", error);
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        modile: req.body.modile,
      },
      { new: true }
    );

    res.json({ message: "Usuário atualizado com sucesso", updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json({ message: "Usuário removido com sucesso", user });
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    throw new Error("Erro ao remover usuário", error);
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.matchPassword(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateRefreshToken = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(401);
    throw new Error("E-mail ou senha inválidos");
  }
});

//handle refresh token
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("Não autorizado, token falhou. Faça login novamente");
  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user)
    throw new Error("Nenhum token no banco de dados ou não correspondido");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Token inválido");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout user
export const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("Token inválido");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204).json({ msg: "Logout com sucesso" });
  }
  await User.findOneAndUpdate({ refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(204).json({ msg: "Logout com sucesso" });
});

export const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        blocked: true,
      },
      { new: true }
    );

    res.json({ msg: "Usuário bloqueado com sucesso", block });
  } catch (error) {
    throw new Error(error);
  }
});

export const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        blocked: false,
      },
      { new: true }
    );

    res.json({ msg: "Usuário desbloqueado com sucesso", unblockUser });
  } catch (error) {
    throw new Error(error);
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDBId(_id);

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json({ msg: "Senha atualizada com sucesso", updatedPassword });
  }
  {
    res.json({ msg: "Erro ao atualizar a senha, tente novamente", user });
  }
});

export const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    throw new Error("Não foi possível encontrar um usuário com este e-mail");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const link = `Ola, este é o link para redefinir sua senha, espira em 10 minutos. <a href='http://localhost:4000/api/users/reset-password/${token}'>Clique aqui para redefinir sua senha</a>`;

    const data = {
      to: process.env.EMAIL, //para onde vai ser enviado o email
      subject: "Redefinir senha",
      text: "Olá Usuário",
      html: link,
    };
    sendEmail(data);

    res.json({ msg: "Token gerado com sucesso", token });
  } catch (error) {
    throw new Error(error);
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token) throw new Error("Token inválido");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token inválido ou expirado");
  if (password) {
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    const updatedPassword = await user.save();
    res.json({ msg: "Senha atualizada com sucesso", updatedPassword });
  }
  {
    res.json({ msg: "Erro ao atualizar a senha, tente novamente", user });
  }
});
