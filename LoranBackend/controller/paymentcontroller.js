import axios from 'axios';
import crypto from 'crypto';
import Order from '../model/order.js';


export const initializePayment = async (req, res) => {
	try {
		const { email, amount, orderId } = req.body;
		if (!email || !amount || !orderId) return res.status(400).json({ message: 'email, amount and orderId are required' });

		const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY;
		const resp = await axios.post(
			'https://api.paystack.co/transaction/initialize',
			{ email, amount: Math.round(amount * 100), metadata: { orderId } },
			{ headers: { Authorization: `Bearer ${PAYSTACK_KEY}` } }
		);

		return res.json({ authorization_url: resp.data.data.authorization_url, access_code: resp.data.data.access_code });
	} catch (err) {
		console.error('initializePayment error:', err?.message || err);
		return res.status(500).json({ message: err.message });
	}
};


export const verifyPayment = async (req, res) => {
	try {
		const { reference } = req.query;
		if (!reference) return res.status(400).json({ message: 'reference query param required' });

		const PAYSTACK_KEY = process.env.PAYSTACK_SECRET_KEY;
		const resp = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${PAYSTACK_KEY}` } });
		if (resp.data.data.status === 'success') {
			const orderId = resp.data.data.metadata?.orderId;
			if (orderId) await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
			return res.json({ message: 'Payment verified' });
		}
		return res.status(400).json({ message: 'Payment not successful' });
	} catch (err) {
		console.error('verifyPayment error:', err?.message || err);
		return res.status(500).json({ message: err.message });
	}
};


export const webhookHandler = async (req, res) => {
	try {
		const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
		const signature = req.headers['x-paystack-signature'];

		// req.body is a Buffer because route uses express.raw()
		const rawBody = req.body;
		const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(rawBody).digest('hex');

		if (signature !== hash) {
			console.warn('Paystack webhook signature mismatch');
			return res.status(400).send('invalid signature');
		}

		const event = JSON.parse(rawBody.toString());
		// Only handle successful charge events
		const eventType = event.event;
		const data = event.data;

		if (data && data.status === 'success') {
			const orderId = data.metadata?.orderId;
			if (orderId) {
				await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', status: 'processing' });
				console.log(`Order ${orderId} marked as paid via webhook`);
			}
		}

		// Respond quickly to webhook
		return res.status(200).send('ok');
	} catch (err) {
		console.error('webhookHandler error:', err?.message || err);
		return res.status(500).send('server error');
	}
};