import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { authorizeRoles } from '../middleware/rolemiddleware.js';
import { saveMeasurements, getMeasurementHistory, getLatestMeasurements } from '../controller/measurementcontroller.js';

const router = express.Router();

// Save measurements (client only)
router.post('/', protect, authorizeRoles('client'), saveMeasurements);

// Get measurement history (client only)
router.get('/history', protect, authorizeRoles('client'), getMeasurementHistory);

// Get latest measurements (client only)
router.get('/latest', protect, authorizeRoles('client'), getLatestMeasurements);

export default router;
