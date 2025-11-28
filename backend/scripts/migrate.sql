-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  budget_limit DECIMAL(20, 6)
);

-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE
);

-- Plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(20, 6) NOT NULL,
  currency TEXT DEFAULT 'ADA',
  interval TEXT CHECK (interval IN ('monthly', 'yearly'))
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  next_payment_date TIMESTAMP,
  vault_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(20, 6) NOT NULL,
  status TEXT CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'pending',
  tx_hash TEXT,
  executed_at TIMESTAMP DEFAULT NOW(),
  is_hydra_simulation BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);