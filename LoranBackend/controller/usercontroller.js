import User from "../model/user.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile (including profile picture)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = {};

    // Handle profile picture upload
    if (req.file) {
      updates.profilePicture = req.file.path;
    }

    // Handle other profile updates
    const allowedUpdates = ["fullName", "email", "phone", "address", "height", "bmi"];
    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get public profile (for designer profiles)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select("fullName email role profilePicture rating totalReviews reviews")
      .populate({
        path: "reviews.clientId",
        select: "fullName profilePicture"
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default { getProfile, updateProfile, getPublicProfile };
