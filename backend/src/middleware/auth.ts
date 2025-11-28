import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Decode JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret'
    ) as { id: string; walletAddress: string };

    // Attach user to request (MATCHES required architecture)
    req.user = {
      id: decoded.id,
      walletAddress: decoded.walletAddress
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}
