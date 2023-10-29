import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { validateMongoDBId } from "../utils/validate.mongodb_id.js";
import User from "../models/user.model.js";

export const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const { title, description, price, brand, slug, category, quantity, sold } =
      req.body;

    if (
      !title ||
      !description ||
      !price ||
      !brand ||
      !slug ||
      !category ||
      !quantity ||
      !sold
    ) {
      return res
        .status(400)
        .json({ msg: "Preencha todos os campos para criar o produto." });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      slug,
      category,
      brand,
      quantity,
      sold,
    });

    await newProduct.save();
    res.json({ msg: "Produto criado com sucesso!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

export const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filtering products
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryStr));
    // Sorting products
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }
    {
      query = query.sort("-createdAt");
    }
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }
    {
      query = query.select("-__v");
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numProducts = await Product.countDocuments();
      if (skip >= numProducts) throw new Error("Esta página não existe");
    }

    const allProducts = await query;
    res.json(allProducts);
  } catch (err) {
    throw new Error("Erro ao buscar todos produtos", err);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDBId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const update = await Product.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        slug: req.body.slug,
        category: req.body.category,
        brand: req.body.brand,
        quantity: req.body.quantity,
        sold: req.body.sold,
      },
      { new: true }
    );

    res.json({ msg: "Produto atualizado com sucesso", update });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({ msg: "Produto não encontrado" });
    }

    res.json({ msg: "Produto excluido com sucesso", product });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  // validateMongoDBId(_id);

  try {
    const user = await User.findById(_id);

    const alreadyInWishlist = user.wishlist.find(
      (id) => id.toString() === prodId
    );

    if (alreadyInWishlist) {
      let user = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );

      return res.json({ msg: "Produto removido da lista de desejos", user });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json({
        msg: "Produto adicionado a lista de desejos",
        user,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Erro ao adicionar o produto a lista de desejos", err });
  }
});

export const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId } = req.body;
  // validateMongoDBId(_id);
  console.log(req.user);

  try {
    const product = await Product.findById(prodId);
    console.log(product);
    let alreadyRated = product.ratings.find(
      (r) => r.postedBy.toString() === _id.String()
    );

    if (alreadyRated) {
      const ratingUpdated = await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": star } },
        { new: true }
      );
      res.json({ msg: "Avaliação atualizada", ratingUpdated });
    } else {
      const ratingAdded = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: { ratings: { star, postedBy: _id } },
        },
        { new: true }
      );
      res.json({ msg: "Avaliação adicionada", ratingAdded });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
