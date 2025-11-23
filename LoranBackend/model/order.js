import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  catalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "Catalogue", required: true },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);