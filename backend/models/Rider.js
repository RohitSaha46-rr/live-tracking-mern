// models/Rider.js
import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const Rider = mongoose.model("Rider", riderSchema);
