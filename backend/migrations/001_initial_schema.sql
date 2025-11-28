-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  budget_limit DECIMAL(10, 2)
);

-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ADA',
  interval VARCHAR(20) CHECK (interval IN ('monthly', 'yearly')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('active', 'paused', 'cancelled')) NOT NULL,
  next_payment_date TIMESTAMP,
  vault_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'ADA',
  status VARCHAR(20) CHECK (status IN ('success', 'failed', 'pending')) NOT NULL,
  tx_hash VARCHAR(255),
  executed_at TIMESTAMP DEFAULT NOW(),
  is_hydra_simulation BOOLEAN DEFAULT FALSE,
  processing_time INTEGER
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);