-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  budget_limit DECIMAL(20, 2)
);

-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(20, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ADA',
  interval VARCHAR(20) NOT NULL CHECK (interval IN ('monthly', 'yearly'))
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')),
  next_payment_date TIMESTAMP,
  vault_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(20, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  tx_hash VARCHAR(255),
  executed_at TIMESTAMP DEFAULT NOW(),
  is_hydra_simulation BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);