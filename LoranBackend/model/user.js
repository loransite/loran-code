import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
fullName: { type: String, required: true },
email: { type: String, required: true },
password: { type: String, required: true },
	role: { type: String, enum: ['client', 'designer', 'admin'] }, // Added back for legacy support
	roles: [{ type: String, enum: ['client', 'designer', 'admin'], required: true }], // Changed to array
	avatarUrl: { type: String },
	bio: { type: String },
	designerStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
	
	// Client-specific fields
	height: { type: Number }, // in cm
	bmi: { type: Number },
	profilePicture: { type: String },
	measurementHistory: [{
		date: { type: Date, default: Date.now },
		method: { type: String, enum: ['ai', 'manual'] },
		measurements: {
			height: Number,
			chest: Number,
			waist: Number,
			hips: Number,
			shoulder: Number,
			sleeveLength: Number,
			inseam: Number
		},
		aiData: {
			frontPhotoUrl: String,
			sidePhotoUrl: String,
			confidence: Number
		}
	}],
	
	// Designer-specific fields
	brandName: { type: String },
	shopAddress: { type: String },
	city: { type: String },
	state: { type: String },
	country: { type: String },
	phone: { type: String },
	logo: { type: String },
	yearsExperience: { type: Number, default: 0 },
	specializations: [{ type: String }], // ['womens-wear', 'mens-wear', 'bridal', etc]
	expertiseLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
	portfolio: [{
		imageUrl: String,
		caption: String,
		uploadedAt: { type: Date, default: Date.now }
	}],
	pricingStructure: { type: String }, // 'hourly', 'project-based', 'custom'
	hourlyRate: { type: Number },
	projectRate: { type: Number },
	workModes: [{ type: String }], // ['in-studio', 'on-site', 'virtual']
	turnaroundTime: { type: String }, // e.g., '7-14 days'
	websiteUrl: { type: String },
	socialLinks: {
		instagram: String,
		facebook: String,
		tiktok: String,
		pinterest: String,
		whatsapp: String
	},
	verificationDocs: [{
		docType: String, // 'id', 'business-registration', 'testimonial'
		docUrl: String,
		verified: { type: Boolean, default: false }
	}],
	paymentMethods: [{
		method: String, // 'bank', 'paystack', 'paypal', 'mobile-money'
		details: mongoose.Schema.Types.Mixed
	}],
	rating: { type: Number, default: 0 },
	totalReviews: { type: Number, default: 0 },
	reviews: [{
		orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
		clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		rating: { type: Number, min: 1, max: 5 },
		comment: String,
		reviewedAt: { type: Date, default: Date.now }
	}],
	resetPasswordToken: { type: String },
	resetPasswordExpiry: { type: Date },
	
	// Email verification fields
	isEmailVerified: { type: Boolean, default: false },
	emailVerificationToken: { type: String },
	emailVerificationExpires: { type: Date },
	
	createdAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true }); // For login queries with uniqueness
userSchema.index({ roles: 1 }); // For role-based queries
userSchema.index({ designerStatus: 1 }); // For admin approval queries
userSchema.index({ rating: -1 }); // For sorting designers by rating
userSchema.index({ createdAt: -1 }); // For sorting by newest
userSchema.index({ 'roles': 1, 'designerStatus': 1 }); // Compound index for designer queries
userSchema.index({ emailVerificationToken: 1 }); // For email verification lookups

export default mongoose.model('User', userSchema);