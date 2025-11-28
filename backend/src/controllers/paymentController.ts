import { Request, Response } from 'express';
import { ApiResponse, Payment } from '../../../shared/types';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { blockfrost } from '../services/blockfrost';
import { simulateHydraPayment } from '../services/hydra-simulation';   // ✅ ADDED THIS

export async function executePayment(req: Request, res: Response) {
  try {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID and amount are required'
      } as ApiResponse<null>);
    }

    // Build and submit transaction via Blockfrost
    const txHash = `tx_${Date.now()}`; // Placeholder

    const payment = await db.query(
      `INSERT INTO payments (id, subscription_id, amount, currency, status, tx_hash, executed_at, is_hydra_simulation)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)
       RETURNING id, subscription_id as "subscriptionId", amount, currency, status, tx_hash as "txHash", executed_at as "executedAt", is_hydra_simulation as "isHydraSimulation"`,
      [uuidv4(), subscriptionId, amount, 'ADA', 'success', txHash]
    );

    res.json({
      success: true,
      data: payment.rows[0]
    } as ApiResponse<Payment>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute payment'
    } as ApiResponse<null>);
  }
}

export async function getReceipt(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, subscription_id as "subscriptionId", amount, currency, status, tx_hash as "txHash", executed_at as "executedAt", is_hydra_simulation as "isHydraSimulation"
       FROM payments WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      } as ApiResponse<null>);
    }

    res.json({
      success: true,
      data: result.rows[0]
    } as ApiResponse<Payment>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch receipt'
    } as ApiResponse<null>);
  }
}

// --------------------------------------------------
// ✅ HYDRA SIMULATION ENDPOINT (ADDED TO EXISTING FILE)
// --------------------------------------------------

export async function executeHydraPayment(req: Request, res: Response) {
  try {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID and amount are required'
      } as ApiResponse<null>);
    }

    const startTime = Date.now();

    // Execute Hydra simulation
    const payment = await simulateHydraPayment(subscriptionId, amount);

    const processingTime = Date.now() - startTime;

    // Save to database
    const result = await db.query(
      `INSERT INTO payments (id, subscription_id, amount, currency, status, tx_hash, executed_at, is_hydra_simulation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id, subscription_id as "subscriptionId", amount, currency, status, tx_hash as "txHash", executed_at as "executedAt", is_hydra_simulation as "isHydraSimulation"`,
      [
        payment.id,
        payment.subscriptionId,
        payment.amount,
        payment.currency,
        payment.status,
        payment.txHash,
        payment.executedAt
      ]
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        processingTime
      },
      message: `Hydra simulation: Payment processed in ${processingTime}ms ⚡`
    } as ApiResponse<Payment>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process Hydra payment simulation'
    } as ApiResponse<null>);
  }
}
