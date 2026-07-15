import 'dotenv/config';
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';

const base = 'http://localhost:5000';
const stamp = Date.now();
const clientEmail = `e2e.client.${stamp}@example.com`;
const adminEmail = `e2e.admin.${stamp}@example.com`;
const password = 'TestPass123!';

const j = async (url, opts = {}) => {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

try {
  console.log('STEP 1: signup client');
  const signup = await j(`${base}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'E2E Client', email: clientEmail, password, roles: ['client'] }),
  });
  if (!signup.ok) throw new Error(`signup failed: ${signup.status} ${JSON.stringify(signup.data)}`);

  console.log('STEP 2: login client');
  const loginClient = await j(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: clientEmail, password, role: 'client' }),
  });
  if (!loginClient.ok || !loginClient.data?.token) {
    throw new Error(`client login failed: ${loginClient.status} ${JSON.stringify(loginClient.data)}`);
  }
  const clientToken = loginClient.data.token;

  console.log('STEP 3: fetch catalogue and pick an item');
  const cat = await j(`${base}/api/catalogue`);
  if (!cat.ok) throw new Error(`catalogue fetch failed: ${cat.status}`);
  const catItems = Array.isArray(cat.data) ? cat.data : (cat.data?.items || []);
  if (!catItems.length) throw new Error('no catalogue items available for order test');
  const picked = catItems[0];
  const catalogueId = picked._id || picked.id;
  const total = Number(picked.price || 10000);
  if (!catalogueId) throw new Error('catalogue item missing id');

  console.log('STEP 4: create order (client)');
  const createOrder = await j(`${base}/api/orders`, {
    method: 'POST',
    headers: authHeader(clientToken),
    body: JSON.stringify({ catalogueId, total, measurementMethod: 'manual', measurements: { chest: 40, waist: 32 } }),
  });
  if (!createOrder.ok || !createOrder.data?.order?._id) {
    throw new Error(`create order failed: ${createOrder.status} ${JSON.stringify(createOrder.data)}`);
  }
  const orderId = createOrder.data.order._id;
  console.log(`created order: ${orderId}`);

  console.log('STEP 5: initialize payment (Paystack redirect URL)');
  const initPayment = await j(`${base}/api/payments/initialize`, {
    method: 'POST',
    headers: authHeader(clientToken),
    body: JSON.stringify({ email: clientEmail, amount: total, orderId }),
  });
  if (!initPayment.ok || !initPayment.data?.authorization_url) {
    throw new Error(`initialize payment failed: ${initPayment.status} ${JSON.stringify(initPayment.data)}`);
  }
  const authUrl = initPayment.data.authorization_url;

  console.log('STEP 6: simulate Paystack success webhook (signed)');
  const payloadObj = {
    event: 'charge.success',
    data: {
      status: 'success',
      reference: `e2e-ref-${stamp}`,
      metadata: { orderId },
    },
  };
  const raw = JSON.stringify(payloadObj);
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY missing');
  const sig = crypto.createHmac('sha512', secret).update(raw).digest('hex');

  const webhook = await fetch(`${base}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-paystack-signature': sig },
    body: raw,
  });
  const webhookText = await webhook.text();
  if (!webhook.ok) throw new Error(`webhook failed: ${webhook.status} ${webhookText}`);

  console.log('STEP 7: verify client sees paid order');
  const clientOrders = await j(`${base}/api/orders/client`, { headers: { Authorization: `Bearer ${clientToken}` } });
  if (!clientOrders.ok) throw new Error(`client orders failed: ${clientOrders.status}`);
  const myOrder = (clientOrders.data || []).find((o) => o._id === orderId);
  if (!myOrder) throw new Error('client cannot see created order');

  console.log('STEP 8: create temp admin and verify admin sees paid order');
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(password, 12);
  await User.updateOne(
    { email: adminEmail },
    {
      $set: {
        fullName: 'E2E Admin',
        email: adminEmail,
        password: hash,
        role: 'admin',
        roles: ['admin'],
        designerStatus: 'none',
        isEmailVerified: true,
      },
    },
    { upsert: true }
  );
  await mongoose.disconnect();

  const loginAdmin = await j(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password, role: 'admin' }),
  });
  if (!loginAdmin.ok || !loginAdmin.data?.token) {
    throw new Error(`admin login failed: ${loginAdmin.status} ${JSON.stringify(loginAdmin.data)}`);
  }
  const adminToken = loginAdmin.data.token;

  const adminOrders = await j(`${base}/api/orders`, { headers: { Authorization: `Bearer ${adminToken}` } });
  if (!adminOrders.ok) throw new Error(`admin orders failed: ${adminOrders.status}`);
  const foundAdminOrder = (adminOrders.data || []).find((o) => o._id === orderId);
  if (!foundAdminOrder) throw new Error('admin cannot see order');

  console.log('\nE2E_RESULT=PASS');
  console.log(
    JSON.stringify(
      {
        clientEmail,
        adminEmail,
        orderId,
        authorization_url_present: Boolean(authUrl),
        client_view: {
          status: myOrder.status,
          paymentStatus: myOrder.paymentStatus,
          paymentReference: myOrder.paymentReference || null,
        },
        admin_view: {
          status: foundAdminOrder.status,
          paymentStatus: foundAdminOrder.paymentStatus,
          paymentReference: foundAdminOrder.paymentReference || null,
        },
      },
      null,
      2
    )
  );
} catch (err) {
  console.error('\nE2E_RESULT=FAIL');
  console.error(err?.message || err);
  process.exitCode = 1;
}
