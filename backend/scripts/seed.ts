import { db } from '../src/config/database';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    /* ============================================================
       1. USERS
    ============================================================ */
    console.log('➡️ Creating users...');
    const users: string[] = [];

    for (let i = 1; i <= 10; i++) {
      const result = await db.query(
        `
        INSERT INTO users (id, wallet_address, preferences, budget_limit)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [uuidv4(), `addr1test${i}`, '{}', 100 + i * 10]
      );
      users.push(result.rows[0].id);
    }

    console.log(`✔️ Created ${users.length} users\n`);


    /* ============================================================
       2. MERCHANTS
    ============================================================ */
    console.log('➡️ Creating merchants...');

    const merchantNames = [
      'Cardano News',
      'Genius Yield',
      'ADAO',
      'JPG Store Premium',
      'Pool Tool'
    ];

    const merchants: string[] = [];

    for (let i = 0; i < merchantNames.length; i++) {
      const result = await db.query(
        `
        INSERT INTO merchants (id, wallet_address, business_name, verified)
        VALUES ($1, $2, $3, true)
        RETURNING id
        `,
        [uuidv4(), `addr1merchant${i}`, merchantNames[i]]
      );
      merchants.push(result.rows[0].id);
    }

    console.log(`✔️ Created ${merchants.length} merchants\n`);


    /* ============================================================
       3. PLANS
    ============================================================ */
    console.log('➡️ Creating plans...');
    const plans: string[] = [];

    for (const merchantId of merchants) {
      // Basic plan
      const basic = await db.query(
        `
        INSERT INTO plans (id, merchant_id, name, description, amount, currency, interval)
        VALUES ($1, $2, 'Basic', 'Basic subscription plan', 10, 'ADA', 'monthly')
        RETURNING id
        `,
        [uuidv4(), merchantId]
      );
      plans.push(basic.rows[0].id);

      // Premium plan
      const premium = await db.query(
        `
        INSERT INTO plans (id, merchant_id, name, description, amount, currency, interval)
        VALUES ($1, $2, 'Premium', 'Premium subscription plan', 25, 'ADA', 'monthly')
        RETURNING id
        `,
        [uuidv4(), merchantId]
      );
      plans.push(premium.rows[0].id);
    }

    console.log(`✔️ Created ${plans.length} plans\n`);


    /* ============================================================
       4. SUBSCRIPTIONS
    ============================================================ */
    console.log('➡️ Creating subscriptions...');
    let subscriptionCount = 0;

    for (const userId of users) {
      const numSubs = Math.floor(Math.random() * 4) + 1; // 1–4 subscriptions

      for (let i = 0; i < numSubs; i++) {
        const planId = plans[Math.floor(Math.random() * plans.length)];
        const status = ['active', 'paused', 'cancelled'][Math.floor(Math.random() * 3)];

        await db.query(
          `
          INSERT INTO subscriptions (id, user_id, plan_id, status, next_payment_date, vault_address)
          VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days', $5)
          `,
          [uuidv4(), userId, planId, status, `vault_${uuidv4()}`]
        );

        subscriptionCount++;
      }
    }

    console.log(`✔️ Created ${subscriptionCount} subscriptions\n`);


    /* ============================================================
       5. PAYMENTS
    ============================================================ */
    console.log('➡️ Creating payments...');

    const subs = await db.query(`SELECT id FROM subscriptions WHERE status = 'active'`);
    let paymentCount = 0;

    for (const sub of subs.rows) {
      const numPayments = Math.floor(Math.random() * 8) + 3; // 3–10 payments

      for (let i = 0; i < numPayments; i++) {
        const isHydra = Math.random() < 0.3; // 30% Hydra

        await db.query(
          `
          INSERT INTO payments (
            id,
            subscription_id,
            amount,
            currency,
            status,
            tx_hash,
            executed_at,
            is_hydra_simulation,
            processing_time
          )
          VALUES ($1, $2, $3, 'ADA', 'success', $4, $5, $6, $7)
          `,
          [
            uuidv4(),
            sub.id,
            10 + Math.floor(Math.random() * 20),
            `tx_${uuidv4()}`,
            new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
            isHydra,
            isHydra ? 120 : 18000
          ]
        );

        paymentCount++;
      }
    }

    console.log(`✔️ Created ${paymentCount} payments\n`);


    /* ============================================================
       DONE
    ============================================================ */
    console.log('🎉 Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
