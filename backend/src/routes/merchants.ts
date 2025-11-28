import express from 'express';
import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/types';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// POST /api/merchants/register
router.post('/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { walletAddress, businessName, logoUrl } = req.body;

    if (!walletAddress || !businessName) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address and business name are required'
      } as ApiResponse<null>);
    }

    const result = await req.db.query(`
      INSERT INTO merchants (wallet_address, business_name, logo_url, verified)
      VALUES ($1, $2, $3, false)
      RETURNING id
    `, [walletAddress, businessName, logoUrl || null]);

    res.json({
      success: true,
      data: { merchantId: result.rows[0].id }
    } as ApiResponse<{ merchantId: string }>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register merchant'
    } as ApiResponse<null>);
  }
});

// GET /api/merchants/me/dashboard
router.get('/me/dashboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    // TODO: Add merchant verification to auth middleware
    const merchantId = req.user.merchantId;

    if (!merchantId) {
      return res.status(403).json({
        success: false,
        error: 'Not a registered merchant'
      } as ApiResponse<null>);
    }

    // Get revenue
    const revenue = await req.db.query(`
      SELECT COALESCE(SUM(pay.amount), 0) as total
      FROM payments pay
      JOIN subscriptions s ON pay.subscription_id = s.id
      JOIN plans p ON s.plan_id = p.id
      WHERE p.merchant_id = $1 AND pay.status = 'success'
    `, [merchantId]);

    // Get subscriber count
    const subscribers = await req.db.query(`
      SELECT COUNT(DISTINCT s.user_id) as count
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE p.merchant_id = $1 AND s.status = 'active'
    `, [merchantId]);

    res.json({
      success: true,
      data: {
        revenue: revenue.rows[0].total,
        subscribers: subscribers.rows[0].count
      }
    } as ApiResponse<any>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard'
    } as ApiResponse<null>);
  }
});

export default router;
