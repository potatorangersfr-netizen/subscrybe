import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/types';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export async function registerMerchant(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;
    const { businessName, logoUrl } = req.body;

    if (!businessName) {
      return res.status(400).json({
        success: false,
        error: 'Business name is required'
      } as ApiResponse<null>);
    }

    const result = await db.query(
      `INSERT INTO merchants (id, wallet_address, business_name, logo_url, verified)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, wallet_address as "walletAddress", business_name as "businessName", logo_url as "logoUrl", verified`,
      [uuidv4(), walletAddress, businessName, logoUrl || null]
    );

    res.json({
      success: true,
      data: result.rows[0]
    } as ApiResponse<any>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register merchant'
    } as ApiResponse<null>);
  }
}

export async function getMerchantDashboard(req: Request, res: Response) {
  try {
    const walletAddress = req.user.walletAddress;

    const merchant = await db.query('SELECT id FROM merchants WHERE wallet_address = $1', [walletAddress]);
    
    if (merchant.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Merchant not found'
      } as ApiResponse<null>);
    }

    const merchantId = merchant.rows[0].id;

    const stats = await db.query(`
      SELECT 
        COUNT(DISTINCT s.id) as subscribers,
        COALESCE(SUM(p.amount), 0) as revenue
      FROM subscriptions s
      JOIN plans pl ON s.plan_id = pl.id
      LEFT JOIN payments p ON p.subscription_id = s.id AND p.status = 'success'
      WHERE pl.merchant_id = $1 AND s.status = 'active'
    `, [merchantId]);

    res.json({
      success: true,
      data: stats.rows[0]
    } as ApiResponse<any>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchant dashboard'
    } as ApiResponse<null>);
  }
}