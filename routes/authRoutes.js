import express from "express";
const router = express.Router();

import {
  register,
  login,
  updateUser,
  getAllUsers,
  getUser,
} from "../controllers/authController.js";
import isAdmin from "../middleware/admin.js";
import authenticateUser from "../middleware/auth.js";

router.route("/users").get(authenticateUser, isAdmin, getAllUsers);
router.route("/user/:id").get(authenticateUser, isAdmin,getUser);
router.route("/register").post(register);
router.route("/login").post(login);

router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
