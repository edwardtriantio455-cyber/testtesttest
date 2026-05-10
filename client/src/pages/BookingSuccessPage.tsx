import { useLocation, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/booths';

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booths = state?.booths ?? [];
  const totalPrice = state?.totalPrice ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted!</h1>
        <p className="text-gray-500 mb-4">
          Thank you{state?.form?.name ? `, ${state.form.name}` : ''}! Your booking has been submitted successfully.
        </p>

        {booths.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
            <div className="text-xs font-semibold uppercase text-gray-400 mb-2">Booked Booths</div>
            {booths.map((b: { id: string; label: string; price: number }) => (
              <div key={b.id} className="flex justify-between text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0">
                <span className="font-semibold text-pink-600">{b.label}</span>
                <span>{formatPrice(b.price)}</span>
              </div>
            ))}
            {booths.length > 1 && (
              <div className="flex justify-between text-sm font-bold text-gray-800 pt-2 mt-1">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700 text-left">
          <strong>What's next?</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Our team will review your payment receipt</li>
            <li>We'll contact you at <strong>{state?.form?.email}</strong></li>
            <li>Confirmation within 1-2 business days</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(-2)}
            className="w-full border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50"
          >
            Book More Booths
          </button>
        </div>
      </div>
    </div>
  );
}
