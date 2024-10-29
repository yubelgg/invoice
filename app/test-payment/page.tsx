import PaymentButton from "@/components/PaymentButton";

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-gray-600 font-bold mb-4">Test Payment</h1>

        <div className="mb-4">
          <h2 className="text-lg text-gray-600 font-semibold">
            Invoice Details
          </h2>
          <p className="text-gray-600">Amount: $99.99</p>
          <p className="text-gray-600">Invoice ID: inv_123</p>
        </div>

        <PaymentButton amount={99.99} invoiceId="inv_123" />
      </div>
    </div>
  );
}
