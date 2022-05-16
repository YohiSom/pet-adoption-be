import Pets from "../models/Pets.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createPet = async (req, res) => {
  const uploadResult =
    req.file && (await cloudinary.uploader.upload(req.file.path));
    req.file && uploadResult && fs.promises.unlink(req.file.path);
  const { type, name, status, img, height, weight, color, hypoallergenic } =
    req.body;
  if (
    !type ||
    !name ||
    !status ||
    // !img ||
    !height ||
    !weight ||
    !color ||
    !hypoallergenic
  ) {
    throw new BadRequestError("Please provide all values!");
  }
  req.body.createdBy = req.user.userId;
  req.body.img = uploadResult.secure_url;
  const pet = await Pets.create(req.body);

  res.status(StatusCodes.CREATED).json({ pet });
};
const deletePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pets.findOne({ _id: petId });
  if (!pet) {
    throw new NotFoundError(`No pet with id : ${petId}`);
  }
  await pet.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Pet Removed" });
};

const getAllPets = async (req, res) => {
  const { type, name, status, height, weight } = req.query;
  const queryobject = {};
  if (type && type != "All") {
    queryobject.type = type;
  }
  if (status && status !== "All") {
    queryobject.status = status;
  }
  if (height) {
    queryobject.height = height;
  }
  if (weight) {
    queryobject.weight = weight;
  }
  if (name) {
    queryobject.name = { $regex: name, $options: "i" };
  }

  let result = Pets.find(queryobject);
  const pets = await result;

  //   return allPets;

  //   const pets = await Pets.find({ Pets });
  res.status(StatusCodes.OK).json({ pets, totalPets: pets.length });
};

const updatePet = async (req, res) => {
  const { id: petId } = req.params;
  const { type, name, status,height,img, weight, color, hypoallergenic } =
    req.body;
  if (
    !type ||
    !name ||
    !status ||
    !height ||
    !weight ||
    !color ||
    !hypoallergenic
  ) {
    throw new BadRequestError("Please provide all values!");
  }
  const pet = await Pets.findOne({ _id: petId });
  if (!pet) {
    throw new NotFoundError(`No pet with id : ${petId}`);
  }
  //   req.body.img = uploadResult.secure_url;
  let update = {};
  if (req.file) {
    const uploadResult =
      req.file && (await cloudinary.uploader.upload(req.file.path));
      req.file && uploadResult && fs.promises.unlink(req.file.path);
    update = { ...req.body, img: uploadResult.secure_url };
  } else update = { ...req.body };

  const updatedPet = await Pets.findOneAndUpdate({ _id: petId }, update, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedPet });
};

const getPet = async (req, res) => {
  try {
    const data = await Pets.findOne({ _id: req.params.id });
    res.status(200).json({ success: data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const savePet = async (req, res) => {
  const { id: petId } = req.params;
  const { userId } = req.body;

  const pet = await Pets.findOne({ _id: petId });

  if (!pet) {
    throw new NotFoundError(`No pet with id : ${petId}`);
  }

  const checkUser = await User.findOne({ _id: userId });
  const isPet = checkUser.savedPets.find((idPet) => idPet.toString() === petId);
  if (isPet) {
    throw new BadRequestError("Pet already saved!");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { savedPets: petId },
    },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ user });
};

const unSavePet = async (req, res) => {
  const { id: petId } = req.params;
  const { userId } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { savedPets: petId },
    },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ user });
};

const adoptPet = async (req, res) => {
  const { id: petId } = req.params;
  const { userId, status } = req.body;
  const pet = await Pets.findOne({ _id: petId });
  if (!pet) {
    throw new NotFoundError(`No pet with id : ${petId}`);
  }

  const petInfo = await Pets.findOneAndUpdate(
    { _id: petId },
    { status: status },
    { new: true, runValidators: true }
  );

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { ownedPets: petInfo },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ user });
};

const returnPet = async (req, res) => {
  const { id: petId } = req.params;
  const { userId, status } = req.body;
  const pet = await Pets.findOne({ _id: petId });
  if (!pet) {
    throw new NotFoundError(`No pet with id : ${petId}`);
  }

  const petInfo = await Pets.findOneAndUpdate(
    { _id: petId },
    { status: status },
    { new: true, runValidators: true }
  );

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { ownedPets: petId },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ user });
};

const getSaved = async (req, res) => {
  const { id: userId } = req.params;
  const { petQuer } = req.query;
  const user = await User.findOne({ _id: userId });

  let myPets = [];
  if (petQuer === "savedPets") {
    myPets = await Pets.find({ _id: { $in: user.savedPets } });
  } 
  else {
    myPets = await Pets.find({ _id: { $in: user.ownedPets } });
  }
  res.status(StatusCodes.OK).json({ myPets, totalSaved: myPets.length });
};



export {
  createPet,
  deletePet,
  getAllPets,
  updatePet,
  getPet,
  savePet,
  unSavePet,
  getSaved,
  adoptPet,
  returnPet
};
