import mongoose from 'mongoose';

const catalogueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    default: 'general',
  },
  image: {
    type: String,
    required: true,
  },
  designer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Catalogue = mongoose.model('Catalogue', catalogueSchema);

export default Catalogue;