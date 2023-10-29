import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: [true, "Nome é obrigatório"] },
    lastname: { type: String, required: [true, "Sobrenome é obrigatório"] },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Por favor, informe um e-mail válido",
      ],
    },
    mobile: {
      type: String,
      unique: true,
      default: "+55",
      required: [true, "Celular é obrigatório"],
    },
    password: {
      type: String,
      minLenght: [6, "A senha deve ter no minimo 6 caracteres"],
      maxLenght: [12, "A senha deve ter no máximo 12 caracteres"],
      required: [true, "Senha é obrigatório"],
    },
    role: { type: String, default: "user" },
    blocked: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: { type: String },

    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

//criptografar a senha antes de salvar no banco de dados
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//comparar a senha do usuário com a senha do banco de dados
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  //criar token
  const resettoken = crypto.randomBytes(32).toString("hex");

  //criptografar o token e salvar no banco de dados
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  //definir a expiração do token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutos
  return resettoken;
};

const User = mongoose.model("User", userSchema);
export default User;
