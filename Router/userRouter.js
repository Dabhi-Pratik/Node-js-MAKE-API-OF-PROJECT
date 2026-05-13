import express from "express";
import userController from "../controller/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/addUser", userController.addUser);
router.post("/login", userController.login);
router.get("/authLogin", auth, userController.authLogin);
router.patch("/updateUser", auth, userController.update);
router.delete("/deleteUser", auth, userController.deleteUser);
router.post("/logout", auth, userController.logOut);
router.post("/logoutAll", auth, userController.logOutAll);
router.get("/getUser", auth, userController.getUser);

export default router;
