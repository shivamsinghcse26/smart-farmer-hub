
import mongoose from "mongoose";
import { User } from "./User.model.js";
const farmerSchema=new mongoose.Schema({

    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  LandSize: {
    type: Number,
    required: true,
    min: [0.1, "Land size must be at least 0.1 acre"],
    max: [10000, "Land size seems unrealistic"]
  },

  CropGrown: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.every(crop => crop.length >= 2);
      },
      message: "Crop name must be at least 2 characters long"
    }
  },

  Experience: {
    type: Number,
    required: true,
    min: [0, "Experience cannot be negative"],
    max: [80, "Experience value is too high"]
  },

  Location: {
    type: String,
    trim: true,
    minlength: [2, "Location must be at least 2 characters"],
    maxlength: [100, "Location is too long"]
  },

  verified: {
    type: Boolean,
    default: false
  }
},
{timestamps:true})
export const Farmer=mongoose.model("farmer",farmerSchema);