import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role, yearsExperience, bio } = req.body;
    // If multer saved a file, set avatarUrl
    const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;
    console.log("Signup payload:", req.body);

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Debug
    const userData = { fullName, email, password: hashedPassword, role };
    if (avatarUrl) userData.avatarUrl = avatarUrl;
    if (bio) userData.bio = bio;
    if (yearsExperience) userData.yearsExperience = Number(yearsExperience) || 0;

    const newUser = new User(userData);
    await newUser.save();
    console.log("User saved:", newUser); // Debug

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl || null,
        yearsExperience: newUser.yearsExperience || 0,
        bio: newUser.bio || null,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message, error.stack); // Detailed logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login payload:", req.body);
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message, err.stack); // Detailed logging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};