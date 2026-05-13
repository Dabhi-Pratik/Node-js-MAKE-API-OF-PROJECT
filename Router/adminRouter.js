import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import checkRole from "../middleware/checkRole.js";
import bookController from "../controller/bookController.js";
import userController from "../controller/userController.js";

const router = express.Router();

//Book

router.post(
  "/addBook",
  auth,
  checkRole("admin"),
  upload.single("bookImage"),
  bookController.addBook,
);

router.patch(
  "/updateBook/:id",
  auth,
  checkRole("admin"),
  upload.single("bookImage"),
  bookController.updateBook,
);

router.delete(
  "/deleteBook/:id",
  auth,
  checkRole("admin"),
  bookController.deleteBook,
);

//user

router.get("/allUser", auth, checkRole("admin"), userController.allUser);

router.patch(
  "/updateUser/:id",
  auth,
  checkRole("admin"),
  userController.update,
);

router.delete(
  "/deleteUser/:id",
  auth,
  checkRole("admin"),
  userController.deleteUser,
);

export default router;
