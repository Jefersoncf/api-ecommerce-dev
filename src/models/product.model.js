import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O titulo do produto é obrigatório"],
      trim: true,
      maxLength: [250, "O titulo do produto não pode exceder 100 caracteres"],
    },
    slug: {
      type: String,
      // required: [true, "O slug do produto é obrigatório"],
      unique: true,
      lowercase: true,
    },

    price: {
      type: Number,
      required: [true, "O preço do produto é obrigatório"],
      maxLength: [5, "O preço do produto não pode exceder 5 caracteres"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "A descrição do produto é obrigatória"],
    },
    category: {
      type: String,
      required: [true, "A categoria do produto é obrigatória"],
    },
    brand: {
      type: String,
      enum: [
        "Apple",
        "Samsung",
        "Microsoft",
        "Lenovo",
        "ASUS",
        "HP",
        "Dell",
        "Acer",
        "Xiaomi",
        "Huawei",
        "Sony",
        "LG",
        "Toshiba",
        "MSI",
        "Alienware",
        "Gateway",
        "Compaq",
        "Fujitsu",
        "IBM",
        "Panasonic",
        "Philips",
        "Positivo",
        "Vaio",
        "Outros",
      ],
      default: "Outros",
      required: [true, "A marca do produto é obrigatória"],
    },
    quantity: {
      type: Number,
      // required: [true, "A quantidade do produto é obrigatória"],
      default: 0,
    },
    sold: {
      type: Number,
      // required: [true, "O saldo do produto é obrigatória"],
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    color: {
      type: String,
      enum: [
        "white",
        "black",
        "blue",
        "red",
        "green",
        "yellow",
        "brown",
        "grey",
        "orange",
        "purple",
        "pink",
      ],
      default: "white",
    },

    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
