import mongoose from 'mongoose';


const designSchema = new mongoose.Schema({
designer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String },
description: { type: String },
imageUrl: { type: String },
price: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Design', designSchema);