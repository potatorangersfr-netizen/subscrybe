import { Request, Response } from 'express';
import { ApiResponse, Subscription, Payment } from '../../../shared/types';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export async function getSubscriptions(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;

    const result = await db.query(`
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
      JOIN users u ON s.user_id = u.id
      WHERE u.wallet_address = $1
      ORDER BY s.created_at DESC
    `, [walletAddress]);

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
}

export async function subscribe(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;
    const { planId, vaultAddress } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID is required'
      } as ApiResponse<null>);
    }

    // Get user ID
    const userResult = await db.query('SELECT id FROM users WHERE wallet_address = $1', [walletAddress]);
    const userId = userResult.rows[0].id;

    // Get plan details
    const planResult = await db.query('SELECT * FROM plans WHERE id = $1', [planId]);
    const plan = planResult.rows[0];

    // Calculate next payment date
    const nextPaymentDate = new Date();
    if (plan.interval === 'monthly') {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else if (plan.interval === 'yearly') {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }

    // Create subscription
    const result = await db.query(
      `INSERT INTO subscriptions (id, user_id, plan_id, status, next_payment_date, vault_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [uuidv4(), userId, planId, 'active', nextPaymentDate, vaultAddress || null]
    );

    // Fetch created subscription with full details
    const subscription = await db.query(`
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
      WHERE s.id = $1
    `, [result.rows[0].id]);

    res.json({
      success: true,
      data: subscription.rows[0]
    } as ApiResponse<Subscription>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription'
    } as ApiResponse<null>);
  }
}

export async function cancelSubscription(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;
    const { id } = req.params;

    await db.query(`
      UPDATE subscriptions s
      SET status = 'cancelled'
      FROM users u
      WHERE s.user_id = u.id 
      AND u.wallet_address = $1 
      AND s.id = $2
    `, [walletAddress, id]);

    res.json({
      success: true,
      data: null
    } as ApiResponse<null>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription'
    } as ApiResponse<null>);
  }
}

export async function pauseSubscription(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;
    const { id } = req.params;

    await db.query(`
      UPDATE subscriptions s
      SET status = 'paused'
      FROM users u
      WHERE s.user_id = u.id 
      AND u.wallet_address = $1 
      AND s.id = $2
    `, [walletAddress, id]);

    res.json({
      success: true,
      data: null
    } as ApiResponse<null>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to pause subscription'
    } as ApiResponse<null>);
  }
}

export async function getPayments(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        p.id,
        p.subscription_id as "subscriptionId",
        p.amount,
        p.status,
        p.tx_hash as "txHash",
        p.executed_at as "executedAt",
        p.is_hydra_simulation as "isHydraSimulation"
      FROM payments p
      JOIN subscriptions s ON p.subscription_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE u.wallet_address = $1 AND s.id = $2
      ORDER BY p.executed_at DESC
    `, [walletAddress, id]);

    res.json({
      success: true,
      data: result.rows
    } as ApiResponse<Payment[]>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    } as ApiResponse<null>);
  }
}