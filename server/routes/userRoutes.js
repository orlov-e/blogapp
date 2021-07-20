import express from "express";
import {
  register,
  login,
  logout,
  likeBlog,
  dislikeBlog,
  profilePictureUpload,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("BlogApp");
});
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/like/:id", likeBlog);
router.post("/dislike/:id", dislikeBlog);
router.post("/dp-upload/:id", profilePictureUpload);

export default router;
