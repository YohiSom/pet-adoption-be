import mongoose from "mongoose";


const PetsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Dog","Cat"],
      required: [true, "Please provide type of pet"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide the name of the pet"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Adopted", "Fostered", "Available"],
      default: "Available",
      required: [true, "Please provide availability of the pet"],
      trim: true,
    },
    img: {
    //   data: Buffer,
      type: String,
      required: [true, "Please provide picture of the pet"],
    },

    height: {
      type: Number,
      required: [true, "Please provide height of the pet"],
    },
    weight: {
      type: Number,
      required: [true, "Please provide weight of the pet"],
    },
    color: {
      type: String,
      required: [true, "Please provide color of the pet"],
    },
    bio: {
      type: String,
      required: [false],
    },
    hypoallergenic: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
      required: [true],
    },
    diet: {
      type: String,
      required: [false],
    },
    breed: {
      type: String,
      required: [false],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pets", PetsSchema);
