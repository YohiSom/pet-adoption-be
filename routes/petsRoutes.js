import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";
import "dotenv/config.js";
import multer from "multer";
const upload = multer({ dest: process.env.UPLOAD_FOLDER + "/" });
import isAdmin from "../middleware/admin.js";

import {
  createPet,
  deletePet,
  getAllPets,
  updatePet,
  getPet,
  savePet,
  unSavePet,
  getSaved,
  adoptPet,
  returnPet,
} from "../controllers/petsController.js";
// import {savePet} from '../controllers/authController.js'

router
  .route("/")
  .post(authenticateUser, isAdmin, upload.single("img"), createPet)
  .get(getAllPets);
router.route("/:id").get(getPet).delete(authenticateUser, isAdmin,deletePet).patch(authenticateUser, isAdmin, upload.single("img"),updatePet);
router.route("/:id/save").patch(authenticateUser,savePet).delete(authenticateUser,unSavePet);
router.route("/user/:id").get(getSaved);
router.route("/:id/adopt").patch(authenticateUser,adoptPet);
router.route("/:id/return").patch(authenticateUser,returnPet);

// router.post("/image", upload.single("img"), async (req, res) => {
//   console.log(req.file);
//   console.log(req.body);
// const uploadResult = await cloudinary.uploader.upload(req.file.path);
// console.log(uploadResult)
//   res.send(uploadResult.secure_url);
// });

export default router;
