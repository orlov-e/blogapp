import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Blog from "../models/blogModel.js";
import cloudinary from "../utils/cloudinary.js";

// @DESC     register a new user
// @METHOD  POST
// @ROUTE   /register
export const register = async (req, res) => {
  const user = req.body;
  try {
    const newUser = await User.create(user);

    res.status(201).json({
      success: true,
      data: newUser,
      error: "",
    });
    console.log(`new User is ${newUser}`.bgGreen);
  } catch (error) {
    res.status(201).json({
      success: false,
      error: error.message,
    });
    console.log(`User register error ${error}`.bgRed);
  }
};

// @DESC    login an existing user
// @METHOD  POST
// @ROUTE   /login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await User.login(email, password);

    if (loginUser.user) {
      const { _id } = loginUser.user;

      const jwtCookie = jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
      });

      res.cookie("jwt", jwtCookie, {
        httpOnly: true,
        maxAge: 1000 * 3 * 24 * 60 * 60,
      });

      res.cookie("id", _id, {
        httpOnly: true,
        maxAge: 1000 * 3 * 24 * 60 * 60,
      });

      res.status(200).json({
        success: true,
        user: loginUser.user,
      });
    }

    if (loginUser.error) {
      res.status(200).json({
        success: false,
        error: loginUser.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @DESC    register a new user
// @METHOD  GET
// @ROUTE   /register
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("id", "", { maxAge: 1 });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @DESC    User liked a blog
// @METHOD  POST
// @ROUTE   /like/:id
export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const { user_id } = req.body;

    await User.updateOne(
      { _id: user_id },
      {
        $addToSet: {
          likedPost: blogId,
        },
      }
    );

    const blog = await Blog.find({ _id: blogId });

    await Blog.updateOne(
      {
        _id: blogId,
      },
      {
        $inc: {
          likeCount: +1,
        },
      }
    );

    const user = await User.find({ _id: user_id });
    const allBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("user");

    res.status(200).json({
      seccess: true,
      data: { blog: allBlogs, user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      seccess: false,
      error: error.message,
    });
  }
};

//    @DESC    unliking a blog post
//    @METHOD  POST
//    @ROUTE   /dislike/:id
export const dislikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const { user_id } = req.body;

    const x = await User.updateOne(
      { _id: user_id },
      {
        $pull: {
          likedPost: blogId,
        },
      }
    );

    const likedBlog = await User.find({ _id: user_id }).populate({
      path: "likedPost",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user" },
    });

    await Blog.updateOne(
      {
        _id: blogId,
      },
      {
        $inc: {
          likeCount: -1,
        },
      }
    );

    const user = await User.find({ _id: user_id });
    const allBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("user");

    res.status(200).json({
      seccess: true,
      data: { blog: allBlogs, user, likedBlog },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      seccess: false,
      error: error.message,
    });
  }
};

//    @DESC    User Profile Picture Upload
//    @METHOd  POST
//    @ROUTE   /dp-upload/:id
export const profilePictureUpload = async (req, res) => {
  try {
    const { base64Image } = req.body;

    const _id = req.params.id;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      upload_preset: "blog_app",
    });

    console.log(uploadResponse);

    await User.updateOne(
      { _id },
      {
        $set: {
          image: uploadResponse.url,
        },
      }
    );

    const updateUser = await User.find({ _id });

    res.status(200).json({
      success: true,
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
