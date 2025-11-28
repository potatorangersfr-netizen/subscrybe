import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../../../shared/types';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomHash(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function simulateHydraPayment(
  subscriptionId: string,
  amount: number
): Promise<Payment> {
  
  // Simulate opening Hydra Head (small delay)
  await delay(50);
  
  // Simulate instant payment inside head
  await delay(70);
  
  // Generate simulated tx hash
  const txHash = `hydra_sim_${generateRandomHash()}`;
  
  // Return payment record marked as simulation
  return {
    id: uuidv4(),
    subscriptionId,
    amount,
    currency: 'ADA',
    status: 'success',
    txHash,
    executedAt: new Date().toISOString(),
    isHydraSimulation: true,
    processingTime: 120
  };
}