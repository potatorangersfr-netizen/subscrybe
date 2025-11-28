import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

export const blockfrost = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_API_KEY || '',
  network: 'preprod'
});

export async function getTransactionDetails(txHash: string) {
  try {
    const tx = await blockfrost.txs(txHash);
    return tx;
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    throw error;
  }
}

export async function monitorWalletAddress(address: string) {
  try {
    const utxos = await blockfrost.addressesUtxos(address);
    return utxos;
  } catch (error) {
    console.error('Failed to monitor wallet:', error);
    throw error;
  }
}

export async function submitTransaction(txCbor: string) {
  try {
    const txHash = await blockfrost.txSubmit(txCbor);
    return txHash;
  } catch (error) {
    console.error('Failed to submit transaction:', error);
    throw error;
  }
}

export async function queryContractUtxos(contractAddress: string) {
  try {
    const utxos = await blockfrost.addressesUtxos(contractAddress);
    return utxos;
  } catch (error) {
    console.error('Failed to query contract UTxOs:', error);
    throw error;
  }
}