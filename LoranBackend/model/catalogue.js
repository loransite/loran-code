// LoranBackend/models/Catalogue.js
import mongoose from "mongoose";

const catalogueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  designer: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Catalogue", catalogueSchema);