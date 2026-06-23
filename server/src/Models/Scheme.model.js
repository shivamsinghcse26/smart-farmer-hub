import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deadline: String,
    link: String,
  },
  { timestamps: true }
);

export const Scheme = mongoose.model("Scheme", schemeSchema);
