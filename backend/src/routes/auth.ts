import express from 'express';
import { connectWallet, verifySignature } from '../controllers/authController';

const router = express.Router();

router.post('/connect-wallet', connectWallet);
router.post('/verify-signature', verifySignature);

export default router;