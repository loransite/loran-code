"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MeasurementStep from "@/components/Order/MeasurementStep";
import CustomizationStep from "@/components/Order/CustomizationStep";
import PaymentStep from "@/components/Order/PaymentStep";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type OrderData = {
  designItem: { id: string; name: string; imageUrl: string; price: number };
  measurements?: any;
  measurementMethod?: "ai" | "manual";
  customizationRequest?: string;
  clientNotes?: string;
  orderId?: string;
};

export default function NewOrderPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"measurement" | "customization" | "payment" | "complete">("measurement");
  const [orderData, setOrderData] = useState<OrderData>({
    designItem: {
      id: searchParams.get("designId") || "",
      name: searchParams.get("designName") || "Custom Design",
      imageUrl: searchParams.get("designImage") || "",
      price: parseFloat(searchParams.get("price") || "0"),
    },
  });

  // Check if returning from AI measurement
  useEffect(() => {
    const aiMeasurements = sessionStorage.getItem("aiMeasurements");
    if (aiMeasurements && searchParams.get("fromAI") === "true") {
      const data = JSON.parse(aiMeasurements);
      setOrderData((prev) => ({
        ...prev,
        measurements: data.measurements,
        measurementMethod: "ai",
      }));
      setStep("customization");
      sessionStorage.removeItem("aiMeasurements");
    }
  }, [searchParams]);

  const handleMeasurementComplete = (data: {
    hasMeasurements: boolean;
    method: "ai" | "manual";
    measurements?: any;
  }) => {
    setOrderData((prev) => ({
      ...prev,
      measurements: data.measurements,
      measurementMethod: data.method,
    }));
    setStep("customization");
  };

  const handleCustomizationComplete = async (data: {
    customizationRequest: string;
    clientNotes: string;
  }) => {
    setOrderData((prev) => ({ ...prev, ...data }));

    // Submit order to backend
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          catalogueId: orderData.designItem.id,
          measurements: orderData.measurements,
          measurementMethod: orderData.measurementMethod,
          customizationRequest: data.customizationRequest,
          clientNotes: data.clientNotes,
          total: orderData.designItem.price,
          status: "awaiting-payment",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderData((prev) => ({ ...prev, orderId: result.order._id }));
        setStep("payment");
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    setStep("complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12">
      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto mb-8 px-6">
        <div className="flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step === "measurement" ? "text-blue-600 font-semibold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step !== "measurement" ? "bg-green-500 text-white" : "bg-blue-600 text-white"
              }`}
            >
              {step !== "measurement" ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <span>Measurements</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div
            className={`flex items-center gap-2 ${
              step === "customization" ? "text-blue-600 font-semibold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ["payment", "complete"].includes(step)
                  ? "bg-green-500 text-white"
                  : step === "customization"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {["payment", "complete"].includes(step) ? <CheckCircle2 className="w-5 h-5" /> : "2"}
            </div>
            <span>Customization</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div
            className={`flex items-center gap-2 ${
              step === "payment" ? "text-blue-600 font-semibold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "complete"
                  ? "bg-green-500 text-white"
                  : step === "payment"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step === "complete" ? <CheckCircle2 className="w-5 h-5" /> : "3"}
            </div>
            <span>Payment</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div
            className={`flex items-center gap-2 ${
              step === "complete" ? "text-green-600 font-semibold" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "complete" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {step === "complete" ? <CheckCircle2 className="w-5 h-5" /> : "4"}
            </div>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === "measurement" && (
        <MeasurementStep onComplete={handleMeasurementComplete} designItem={orderData.designItem} />
      )}

      {step === "customization" && (
        <CustomizationStep
          onComplete={handleCustomizationComplete}
          onBack={() => setStep("measurement")}
        />
      )}

      {step === "payment" && orderData.orderId && (
        <PaymentStep
          orderId={orderData.orderId}
          amount={orderData.designItem.price}
          email={localStorage.getItem("userEmail") || ""}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {step === "complete" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto p-6"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Submitted Successfully!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your order! Our team will contact you shortly to discuss your requirements
              in detail. Your order will then be assigned to the designer.
            </p>
            <div className="space-y-3">
              <a
                href="/dashboard/client"
                className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Orders
              </a>
              <a
                href="/catalogue"
                className="block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
