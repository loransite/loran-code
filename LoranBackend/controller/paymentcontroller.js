import axios from 'axios';
import crypto from 'crypto';
import Order from '../model/order.js';
import User from '../model/user.js';
import Catalogue from '../model/catalogue.js';
import { sendEmail } from '../services/emailService.js';


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
		// If this was an Axios/Paystack error, log response body for easier debugging
		if (err?.response) {
			console.error('initializePayment Paystack response error:', {
				status: err.response.status,
				data: err.response.data,
			});
		} else {
			console.error('initializePayment error:', err?.message || err);
		}
		return res.status(500).json({ message: err.message || 'server error' });
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
      const reference = data.reference;
			if (orderId) {
				// Update order: mark as paid, set to awaiting-contact
				const updatedOrder = await Order.findByIdAndUpdate(
					orderId,
					{
						paymentStatus: 'paid',
						status: 'awaiting-contact',
						paymentReference: reference,
						updatedAt: new Date(),
					},
					{ new: true }
				).populate('userId', 'fullName email')
         .populate('catalogueId', 'title price')
         .populate('designerId', 'fullName email');

				console.log(`Order ${orderId} marked as paid via webhook, reference: ${reference}`);

				// Send email notifications
				try {
          // Notify client
          if (updatedOrder?.userId?.email) {
            await sendEmail({
              to: updatedOrder.userId.email,
              template: 'orderConfirmation',
              data: {
                customerName: updatedOrder.userId.fullName,
                orderId: updatedOrder._id,
                designName: updatedOrder.catalogueId?.title || 'Custom Design',
                amount: updatedOrder.total,
              },
            });
          }

          // Notify designer if assigned
          if (updatedOrder?.designerId?.email) {
            await sendEmail({
              to: updatedOrder.designerId.email,
              template: 'designerOrderNotification',
              data: {
                designerName: updatedOrder.designerId.fullName,
                orderId: updatedOrder._id,
                customerName: updatedOrder.userId.fullName,
                designName: updatedOrder.catalogueId?.title || 'Custom Design',
                amount: updatedOrder.total,
                measurements: updatedOrder.measurements,
                customizationRequest: updatedOrder.customizationRequest,
              },
            });
          }
				} catch (mailErr) {
					console.error('Error sending notification emails:', mailErr);
				}
			}
    }		// Respond quickly to webhook
		return res.status(200).send('ok');
	} catch (err) {
		console.error('webhookHandler error:', err?.message || err);
		return res.status(500).send('server error');
	}
};