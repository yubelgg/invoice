"use client";

import { useState } from "react";

interface PaymentButtonProps {
  amount: number;
  invoiceId: string;
}

export default function PaymentButton({ amount, invoiceId }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          invoiceId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Check for sessionUrl in the response
      if (!data.sessionUrl) {
        console.error('Response data:', data);
        throw new Error('No session URL returned');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
