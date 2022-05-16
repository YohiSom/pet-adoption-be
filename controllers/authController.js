import User from "../models/User.js";
import Pets from "../models/Pets.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password, lastname, phonenumber } = req.body;

  if (!name || !email || !password || !lastname || !phonenumber) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("This email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    lastname,
    phonenumber,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastname: user.lastname,
      phonenumber: user.phonenumber,
      _id: user._id, 
      savedPets: user.savedPets,
      ownedPets: user.ownedPets,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT()
  

  user.password = undefined //to remove password in backend
  res.status(StatusCodes.OK).json({user, token});
};



const updateUser = async (req, res) => {
  const {email, name, lastname, phonenumber, password} = req.body
  if (!name || !email || !password || !lastname || !phonenumber) {
    throw new BadRequestError("Please provide all values")}
  const user = await User.findOne({_id:req.user.userId})

  user.email = email
  user.name = name
  user.lastname = lastname
  user.phonenumber = phonenumber
  user.password = password

  await user.save()

  const token = user.createJWT()
  
  user.password = undefined //to remove password in backend

  res.status(StatusCodes.OK).json({user, token})
}

const getAllUsers = async (req, res) => {
  try {
    const profiles = await User.find({});
    res.status(200).json({profiles, totalUsers: profiles.length});
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getUser = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.params.id });
    res.status(200).json({ success: data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};


export { register, login, updateUser, getAllUsers,getUser };
