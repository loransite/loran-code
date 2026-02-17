"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { paymentAPI } from "@/lib/api";

interface PaymentStepProps {
  orderId: string;
  amount: number;
  email: string;
  onPaymentSuccess?: () => void;
}

export default function PaymentStep({ orderId, amount, email }: PaymentStepProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Initialize payment with Paystack
      const response = await paymentAPI.initialize({
        email,
        amount,
        orderId,
      });

      // Redirect to Paystack payment page
      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (err: unknown) {
      console.error("Payment initialization error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to initialize payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Complete Your Order</h2>
          <p className="text-gray-600">Secure payment powered by Paystack</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Design Cost</span>
              <span className="font-semibold">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold">₦0</span>
            </div>
            <div className="border-t border-purple-200 pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-purple-600">₦{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Secure Payment</p>
              <p className="text-blue-700">Your payment is processed securely through Paystack. We accept cards, bank transfers, and USSD.</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">{error}</div>
          </motion.div>
        )}

        {/* Payment Button */}
        <motion.button
          whileHover={{ scale: processing ? 1 : 1.02 }}
          whileTap={{ scale: processing ? 1 : 0.98 }}
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirecting to Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₦{amount.toLocaleString()}
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-gray-500 mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </motion.div>
  );
}
