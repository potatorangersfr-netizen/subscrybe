import express from 'express';
import { Request, Response } from 'express';
import { ApiResponse, Subscription } from '../../../shared/types';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// GET /api/subscriptions
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await req.db.query(`
      SELECT 
        s.id,
        s.user_id as "userId",
        s.plan_id as "planId",
        p.name as "planName",
        m.business_name as "merchantName",
        p.amount,
        p.currency,
        p.interval,
        s.status,
        s.next_payment_date as "nextPaymentDate",
        s.vault_address as "vaultAddress",
        s.created_at as "createdAt"
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      JOIN merchants m ON p.merchant_id = m.id
      WHERE s.status = 'active'
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    } as ApiResponse<Subscription[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions'
    } as ApiResponse<null>);
  }
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId, vaultAddress } = req.body;

    if (!planId || !vaultAddress) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID and vault address are required'
      } as ApiResponse<null>);
    }

    // Get plan details
    const plan = await req.db.query(
      'SELECT * FROM plans WHERE id = $1',
      [planId]
    );

    if (plan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      } as ApiResponse<null>);
    }

    // Calculate next payment date
    const nextPaymentDate = new Date();
    if (plan.rows[0].interval === 'monthly') {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else if (plan.rows[0].interval === 'yearly') {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }

    // Create subscription
    const result = await req.db.query(`
      INSERT INTO subscriptions (user_id, plan_id, status, next_payment_date, vault_address)
      VALUES ($1, $2, 'active', $3, $4)
      RETURNING id
    `, [userId, planId, nextPaymentDate, vaultAddress]);

    const subscriptionId = result.rows[0].id;

    res.json({
      success: true,
      data: { subscriptionId, message: 'Subscription created successfully' }
    } as ApiResponse<{ subscriptionId: string; message: string }>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription'
    } as ApiResponse<null>);
  }
});

// DELETE /api/subscriptions/:id/cancel
router.delete('/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    // Verify ownership
    const subscription = await req.db.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      } as ApiResponse<null>);
    }

    // Update status to cancelled
    await req.db.query(
      'UPDATE subscriptions SET status = $1 WHERE id = $2',
      ['cancelled', subscriptionId]
    );

    res.json({
      success: true,
      data: { message: 'Subscription cancelled successfully' }
    } as ApiResponse<{ message: string }>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    } as ApiResponse<null>);
  }
});

// PUT /api/subscriptions/:id/pause
router.put('/:id/pause', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    // Verify ownership
    const subscription = await req.db.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      } as ApiResponse<null>);
    }

    // Toggle pause status
    const newStatus = subscription.rows[0].status === 'paused' ? 'active' : 'paused';

    await req.db.query(
      'UPDATE subscriptions SET status = $1 WHERE id = $2',
      [newStatus, subscriptionId]
    );

    res.json({
      success: true,
      data: { status: newStatus }
    } as ApiResponse<{ status: string }>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    } as ApiResponse<null>);
  }
});

// GET /api/subscriptions/:id/payments
router.get('/:id/payments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;

    // Verify ownership
    const subscription = await req.db.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      } as ApiResponse<null>);
    }

    // Get payment history
    const payments = await req.db.query(`
      SELECT 
        id,
        subscription_id as "subscriptionId",
        amount,
        currency,
        status,
        tx_hash as "txHash",
        executed_at as "executedAt",
        is_hydra_simulation as "isHydraSimulation",
        processing_time as "processingTime"
      FROM payments
      WHERE subscription_id = $1
      ORDER BY executed_at DESC
    `, [subscriptionId]);

    res.json({
      success: true,
      data: payments.rows
    } as ApiResponse<any[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    } as ApiResponse<null>);
  }
});

export default router;
