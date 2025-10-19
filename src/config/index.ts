import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
  cloudinary: {
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  },
  open_router_api_key: process.env.OPEN_ROUTER_API_KEY,
};
