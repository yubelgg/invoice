export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          Thank you for your payment. You will receive a confirmation email
          shortly.
        </p>
      </div>
    </div>
  );
}
