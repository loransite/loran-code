import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  catalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "Catalogue", required: true },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled", "confirmed"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, required: true },
  measurements: { height: Number, chest: Number, waist: Number, hips: Number, sleeveLength: Number, notes: String },
  measurementMethod: { type: String, enum: ['ai', 'manual'], default: null },
  shipping: { name: String, phone: String, address: String, city: String, postalCode: String, country: String },
  paymentReference: String,
  paymentMethod: { type: String, default: 'paystack' },
  metadata: mongoose.Schema.Types.Mixed,
  notified: { admin: { type: Boolean, default: false }, designer: { type: Boolean, default: false } },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);