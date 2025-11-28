-- seed.sql
INSERT INTO users (wallet_address) VALUES ('addr1testuser0') ON CONFLICT DO NOTHING;
