import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
fullName: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
	role: { type: String, enum: ['client', 'designer', 'admin'], required: true },
	avatarUrl: { type: String },
	bio: { type: String },
	yearsExperience: { type: Number, default: 0 },
	rating: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('User', userSchema);