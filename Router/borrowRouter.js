import express from "express";
import auth from "../middleware/auth.js";
import borrowController from "../controller/borrowController.js";

const router = express.Router();

router.post("/borrowBook", auth, borrowController.borrowBook);
router.put("/returnBook", auth, borrowController.returnBook);
router.get("/history", auth, borrowController.borrowHistory);

export default router;
