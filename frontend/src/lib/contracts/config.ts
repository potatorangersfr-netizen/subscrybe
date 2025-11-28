// frontend/src/lib/contracts/config.ts

export const contractAddresses = {
  registry: 'addr1_registry_from_role1', // Replace with actual address from Role 1
  vault: 'addr1_vault_from_role1',       // Replace with actual address from Role 1
  executor: 'addr1_executor_from_role1', // Replace with actual address from Role 1
};

export const cardanoNetwork = process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod';