import express from 'express';
import { getMe, updatePreferences, getMySubscriptions, getSpendingAnalytics } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/me', authMiddleware, getMe);
router.put('/me/preferences', authMiddleware, updatePreferences);
router.get('/me/subscriptions', authMiddleware, getMySubscriptions);
router.get('/me/spending-analytics', authMiddleware, getSpendingAnalytics);

export default router;