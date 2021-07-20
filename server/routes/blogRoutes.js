import express from "express";
import {
  getBlogs,
  createBlog,
  deleteBlog,
  updateBlogs,
  getProfileBlogs,
  getUserClickedBlog,
  getUserLikedPosts,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);
router.post("/post", createBlog);
router.delete("/delete/:id", deleteBlog);
router.patch("/edit/:id", updateBlogs);
router.get("/:id", getProfileBlogs);
router.get("/u/:id", getUserClickedBlog);
router.get("/:id/likedpost", getUserLikedPosts);

export default router;
