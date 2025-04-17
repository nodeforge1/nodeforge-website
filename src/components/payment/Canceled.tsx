import { Link } from "react-router-dom";

export default function Canceled() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled ❌</h1>
      <p className="mt-2 text-gray-700">
        Your payment was canceled. You can try again whenever you're ready.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
