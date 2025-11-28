import { Request, Response } from 'express';
import { ApiResponse, User, Subscription } from '../../../shared/types';

// ----------------------------------------------
// GET /api/users/me
// ----------------------------------------------
export async function getMe(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const result = await req.db.query(
      `SELECT id, wallet_address, created_at, preferences, budget_limit
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse<null>);
    }

    return res.json({
      success: true,
      data: result.rows[0]
    } as ApiResponse<User>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    } as ApiResponse<null>);
  }
}

// ----------------------------------------------
// PUT /api/users/me/preferences
// ----------------------------------------------
export async function updatePreferences(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const { preferences, budget_limit } = req.body;

    await req.db.query(
      `UPDATE users 
       SET preferences = $1, budget_limit = $2 
       WHERE id = $3`,
      [JSON.stringify(preferences), budget_limit, userId]
    );

    return res.json({
      success: true,
      data: { message: 'Preferences updated' }
    } as ApiResponse<{ message: string }>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    } as ApiResponse<null>);
  }
}

// ----------------------------------------------
// GET /api/users/me/subscriptions
// ----------------------------------------------
export async function getMySubscriptions(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const result = await req.db.query(`
      SELECT 
        s.id,
        s.user_id AS "userId",
        s.plan_id AS "planId",
        p.name AS "planName",
        m.business_name AS "merchantName",
        p.amount,
        p.currency,
        p.interval,
        s.status,
        s.next_payment_date AS "nextPaymentDate",
        s.vault_address AS "vaultAddress",
        s.created_at AS "createdAt"
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      JOIN merchants m ON p.merchant_id = m.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `, [userId]);

    return res.json({
      success: true,
      data: result.rows
    } as ApiResponse<Subscription[]>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions'
    } as ApiResponse<null>);
  }
}

// ----------------------------------------------
// GET /api/users/me/spending-analytics
// ----------------------------------------------
export async function getSpendingAnalytics(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const totalSpending = await req.db.query(`
      SELECT 
        SUM(p.amount) AS total,
        COUNT(*) AS payment_count
      FROM payments p
      JOIN subscriptions s ON p.subscription_id = s.id
      WHERE s.user_id = $1 AND p.status = 'success'
    `, [userId]);

    const monthlyBreakdown = await req.db.query(`
      SELECT 
        DATE_TRUNC('month', p.executed_at) AS month,
        SUM(p.amount) AS amount
      FROM payments p
      JOIN subscriptions s ON p.subscription_id = s.id
      WHERE s.user_id = $1 AND p.status = 'success'
      GROUP BY DATE_TRUNC('month', p.executed_at)
      ORDER BY month DESC
      LIMIT 12
    `, [userId]);

    return res.json({
      success: true,
      data: {
        total: totalSpending.rows[0]?.total || 0,
        paymentCount: totalSpending.rows[0]?.payment_count || 0,
        monthlyBreakdown: monthlyBreakdown.rows
      }
    } as ApiResponse<any>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    } as ApiResponse<null>);
  }
}
