import User from '../model/user.js';

// Save measurements to user history
export const saveMeasurements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { measurements, method, aiData } = req.body;

    if (!measurements) {
      return res.status(400).json({ message: 'Measurements are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to measurement history
    if (!user.measurementHistory) {
      user.measurementHistory = [];
    }

    user.measurementHistory.push({
      date: new Date(),
      method: method || 'manual',
      measurements,
      aiData: aiData || {}
    });

    // Update current height if provided
    if (measurements.height) {
      user.height = measurements.height;
    }

    await user.save();

    res.json({ 
      message: 'Measurements saved successfully',
      measurementHistory: user.measurementHistory 
    });
  } catch (error) {
    console.error('Save measurements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get measurement history
export const getMeasurementHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('measurementHistory height');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      measurementHistory: user.measurementHistory || [],
      currentHeight: user.height
    });
  } catch (error) {
    console.error('Get measurement history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get latest measurements
export const getLatestMeasurements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('measurementHistory height');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const latest = user.measurementHistory && user.measurementHistory.length > 0
      ? user.measurementHistory[user.measurementHistory.length - 1]
      : null;

    res.json({ 
      latestMeasurements: latest,
      currentHeight: user.height
    });
  } catch (error) {
    console.error('Get latest measurements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default { saveMeasurements, getMeasurementHistory, getLatestMeasurements };
