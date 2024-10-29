export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600">
          Your payment was cancelled. Please try again or contact support if you
          need assistance.
        </p>
      </div>
    </div>
  );
}
