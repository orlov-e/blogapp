import dotenv from "dotenv";
import cloudinary from "cloudinary";

const { v2 } = cloudinary;

v2.config({
  cloud_name: process.env.CLOUD_NAME || "eugeneorlov",
  api_key: process.env.API_KEY || "217994454564179",
  api_secret: process.env.API_SECRET || "/",
});

export default v2;
