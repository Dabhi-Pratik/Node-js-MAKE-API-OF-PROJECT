import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.post("/addUser", userController.addUser);
router.post("/login", userController.login);

export default router;
