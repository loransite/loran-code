import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  catalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "Catalogue", required: true },
  status: { type: String, enum: ["pending", "awaiting-payment", "awaiting-contact", "processing", "completed", "cancelled", "confirmed"], default: "pending" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, required: true },
  
  // Measurements workflow
  hasMeasurements: { type: Boolean, default: false },
  measurements: { 
    height: Number, 
    chest: Number, 
    waist: Number, 
    hips: Number, 
    shoulder: Number,
    sleeveLength: Number, 
    inseam: Number,
    notes: String 
  },
  measurementMethod: { type: String, enum: ['ai', 'manual'], default: null },
  aiMeasurementData: {
    frontPhotoUrl: String,
    sidePhotoUrl: String,
    processedAt: Date,
    confidence: Number,
    apiSource: String
  },
  
  // Customization/tweaks
  customizationRequest: { type: String }, // What tweaks the client wants
  clientNotes: { type: String }, // Additional notes from client
  designerNotes: { type: String }, // Designer's notes after contact
  
  // Workflow tracking
  contactedAt: { type: Date },
  contactMethod: { type: String }, // 'phone', 'email', 'whatsapp'
  adminReviewedAt: { type: Date },
  assignedToDesignerAt: { type: Date },
  
  // Review and Rating
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    reviewedAt: { type: Date },
    isReviewed: { type: Boolean, default: false }
  },
  
  shipping: { name: String, phone: String, address: String, city: String, postalCode: String, country: String },
  paymentReference: String,
  paymentMethod: { type: String, default: 'paystack' },
  metadata: mongoose.Schema.Types.Mixed,
  notified: { admin: { type: Boolean, default: false }, designer: { type: Boolean, default: false } },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 }); // For user's order history
orderSchema.index({ designerId: 1, status: 1 }); // For designer's orders
orderSchema.index({ status: 1, createdAt: -1 }); // For admin order management
orderSchema.index({ paymentStatus: 1 }); // For payment tracking
orderSchema.index({ 'review.isReviewed': 1 }); // For review queries

export default mongoose.model("Order", orderSchema);