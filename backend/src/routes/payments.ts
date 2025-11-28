import express from 'express';
import { Request, Response } from 'express';
import { ApiResponse, Payment } from '../../../shared/types';
import { authMiddleware } from '../middleware/auth';
import { executeBlockfrostPayment } from '../services/blockfrost';
import { simulateHydraPayment } from '../services/hydraSimulation';

const router = express.Router();

/* ============================================================
   POST /api/payments/execute
============================================================ */
router.post('/execute', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID and amount are required'
      });
    }

    const startTime = Date.now();
    const txHash = await executeBlockfrostPayment(subscriptionId, amount);
    const processingTime = Date.now() - startTime;

    const result = await req.db.query(`
      INSERT INTO payments (
        subscription_id,
        amount,
        currency,
        status,
        tx_hash,
        executed_at,
        is_hydra_simulation,
        processing_time
      )
      VALUES ($1, $2, 'ADA', 'success', $3, NOW(), false, $4)
      RETURNING *
    `, [subscriptionId, amount, txHash, processingTime]);

    return res.json({
      success: true,
      data: result.rows[0]
    } as ApiResponse<Payment>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Payment execution failed'
    });
  }
});

/* ============================================================
   POST /api/payments/execute-hydra
============================================================ */
router.post('/execute-hydra', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Subscription ID and amount are required'
      });
    }

    const payment = await simulateHydraPayment(subscriptionId, amount);

    const result = await req.db.query(`
      INSERT INTO payments (
        subscription_id,
        amount,
        currency,
        status,
        tx_hash,
        executed_at,
        is_hydra_simulation,
        processing_time
      )
      VALUES ($1, $2, 'ADA', 'success', $3, NOW(), true, $4)
      RETURNING *
    `, [
      payment.subscriptionId,
      payment.amount,
      payment.txHash,
      payment.processingTime
    ]);

    return res.json({
      success: true,
      data: result.rows[0],
      message: `Hydra simulation: Payment processed in ${payment.processingTime}ms ⚡`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to process Hydra payment simulation'
    });
  }
});

/* ============================================================
   GET /api/payments/:id/receipt
============================================================ */
router.get('/:id/receipt', authMiddleware, async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    const result = await req.db.query(`
      SELECT 
        p.*,
        s.plan_id,
        pl.name AS plan_name,
        m.business_name AS merchant_name
      FROM payments p
      JOIN subscriptions s ON p.subscription_id = s.id
      JOIN plans pl ON s.plan_id = pl.id
      JOIN merchants m ON pl.merchant_id = m.id
      WHERE p.id = $1
    `, [paymentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch receipt'
    });
  }
});

export default router;
