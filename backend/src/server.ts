import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
