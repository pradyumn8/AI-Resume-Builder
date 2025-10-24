import express from 'express'
import protect from '../middlewares/authMiddleware.js';
import { enchanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controller/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enchanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)

export default aiRouter