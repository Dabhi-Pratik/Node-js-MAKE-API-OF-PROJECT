import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import express from "express";
import HttpError from "./middleware/HttpError.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

import userRouter from "./Router/userRouter.js";
import adminRouter from "./Router/adminRouter.js";
import borrowRouter from "./Router/borrowRouter.js";

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/borrow", borrowRouter);

app.get("/", (req, res) => {
  res.status(200).json("Hello from Server.....!");
});

app.use((req, res, next) => {
  return next(new HttpError("Requested Route not Founded....!", 404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error...!",
  });
});

async function startServer() {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server Running on Port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

startServer();
