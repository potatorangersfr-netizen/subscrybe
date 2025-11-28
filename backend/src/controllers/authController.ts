import { Request, Response } from 'express';
import { ApiResponse } from '../../../shared/types';
import jwt from 'jsonwebtoken';
import { verifyDataSignature } from '@meshsdk/core';

export async function connectWallet(req: Request, res: Response) {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      } as ApiResponse<null>);
    }

    const challenge = `Sign this message to authenticate: ${Date.now()}`;

    return res.json({
      success: true,
      data: { challenge, walletAddress }
    } as ApiResponse<{ challenge: string; walletAddress: string }>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate wallet connection'
    } as ApiResponse<null>);
  }
}

export async function verifySignature(req: Request, res: Response) {
  try {
    const { walletAddress, signature, challenge } = req.body;

    if (!walletAddress || !signature || !challenge) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address, signature, and challenge are required'
      } as ApiResponse<null>);
    }

    // Correct Mesh SDK verification
    const isValid = await verifyDataSignature(walletAddress, signature, challenge);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      } as ApiResponse<null>);
    }

    // Create or fetch user
    const userQuery = await req.db.query(
      `INSERT INTO users (wallet_address)
       VALUES ($1)
       ON CONFLICT (wallet_address) DO UPDATE SET wallet_address = $1
       RETURNING id, wallet_address, created_at, preferences, budget_limit`,
      [walletAddress]
    );

    const user = userQuery.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, walletAddress: user.wallet_address },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: { token, user }
    } as ApiResponse<{ token: string; user: any }>);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify signature'
    } as ApiResponse<null>);
  }
}
