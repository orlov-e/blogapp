import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

// @DESC    get all the blogs
// @METHOD  GET
// @ROUTE   /blogs
export const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find()
      .populate("user")
      .sort({ createdAt: "desc" });

    if (allBlogs) {
      res.status(200).json({
        success: true,
        data: allBlogs,
      });
    } else {
      res.json({
        success: false,
        error: "eror",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @DESC    post a new blog
// @METHOD  POST
// ROUTE    /blogs/post
export const createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    const allBlogs = await Blog.find().sort({ createdAt: -1 }).populate("user");

    res.status(201).json({
      success: true,
      data: allBlogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DESC     delete a blog
// METHOD   DELETE
// ROUTE    blogs/delete/:id
export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;

    const blog = await Blog.find({ _id: id });

    // if that blog dont exist
    if (!blog) {
      res.status(200).json({
        success: false,
        error: "Blog dont exist",
      });
    }

    if (blog && blog.user == req.cookies.id) {
      // Deleting the blog from database
      const deletedBlog = await Blog.remove({ _id: id });
      // server response at success

      // getting updated blogs
      const all_blogs = await Blog.find()
        .populate("user")
        .sort({ createdAt: "desc" });

      //
      res.status(200).json({
        success: true,
        data: all_blogs,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//    @DESC    Update or edit a existing blog
//    @METHOD  PETCH
//    @ROUTE   /blogs/edit/:id
export const updateBlogs = async (req, res) => {
  const { title, body, user } = req.body;
  const id = req.params.id;

  try {
    const updateBlog = await Blog.update(
      { _id: id },
      {
        $set: {
          title,
          body,
        },
      }
    );

    const allBlogs = await Blog.find().sort({ createdAt: -1 }).populate("user");

    const userBlogs = await Blog.find({ user });

    if (!updateBlog) {
      return res.status(404).json({
        success: false,
        error: "Blog dont exist",
      });
    }

    res.status(201).json({
      success: true,
      data: {
        allBlogs,
        userBlogs,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//    @DESC    get all the blogs to show in user profile
//    @METHOD  GET
//    @ROUTE   /blogs/:id
export const getProfileBlogs = async (req, res) => {
  try {
    // Getting the user id from params
    const user = req.params.id;
    // Gettting all the blogs that user post from database
    const userBlogs = await Blog.find({ user });

    if (!userBlogs.length) {
      res.status(200).json({
        success: true,
        message: "NO_BLOGS",
      });
    } else {
      res.status(200).json({
        success: true,
        data: userBlogs,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

//    @DESC    Findin the exact blog by clicking edit in front end
//    @METHID  GET
//    @ROUTE   /blogs/u/:id
export const getUserClickedBlog = async (req, res) => {
  try {
    const _id = req.params.id;
    const blog = await Blog.find({ _id });
    if (blog) {
      res.status(200).json({
        success: true,
        data: blog,
      });
    } else {
      res.status(200).json({
        success: false,
        data: "No blog found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//    @DESC     getting the all the blogs that user liked
//    @METHOD   GET
//    @ROUTE    /blogs/:id/likedpost
export const getUserLikedPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const likedPost = await User.find({ _id: id }).populate({
      path: "likedPost",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user" },
    });

    res.status(200).json({
      success: true,
      data: likedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
