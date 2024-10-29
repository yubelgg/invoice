import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Invoice Generator</h1>

      <div className="space-x-4">
        <Link
          href="/auth"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Get Started
        </Link>

        <Link
          href="/pricing"
          className="inline-block text-blue-500 hover:text-blue-600"
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}
