import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 1,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false,
  },
  lastname: {
    type: String,
    required: [true, "Please provide lastname"],
    minlength: 1,
    maxlength: 40,
    trim: true,
  },
  phonenumber: {
    type: Number,
    required: [true, "Please provide phonenumber"],
    minlength: 7,
    maxlength: 20,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    required: [false],
  },
  savedPets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
    required: false,
    unique: true
  }],
  ownedPets:[{type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
    required: false,
    unique: true

  }]
});
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model("User", UserSchema);
