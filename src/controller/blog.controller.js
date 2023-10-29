import Blog from "../models/blog.model.js";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { validateMongoDBId } from "../utils/validate.mongodb_id.js";

export const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({ msg: "Blog criado com sucesso", newBlog });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ msg: "Blog atualizado com sucesso", updateBlog });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getOneBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");

    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    res.json({ blog });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);

    res.json({ msg: "Blog deletado com sucesso", blog });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export const likeTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  console.log(blogId);
  validateMongoDBId(blogId);

  const blog = await Blog.findById(blogId);

  const loginUserId = req?.user?._id;
  const isLiked = blog?.isLiked;

  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    const updateDislikes = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json({ msg: "Post descurtido com sucesso", updateDislikes });
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json({ msg: "Post descurtido com sucesso", blog });
  } else {
    const liked = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json({ msg: "Post curtido com sucesso", liked });
  }
});

export const dislikeTheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  console.log(blogId);
  validateMongoDBId(blogId);

  const blog = await Blog.findById(blogId);

  const loginUserId = req?.user?._id;
  const isDisliked = blog?.isDisliked;

  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const updateDislikes = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json({ msg: "Post já marcado como curtido", updateDislikes });
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json({ msg: "Post descurtido com sucesso", blog });
  } else {
    const liked = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json({ msg: "Post curtido com sucesso", liked });
  }
});
