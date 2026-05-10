import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { allBooths, formatPrice } from '../data/booths';
import type { Area } from '../data/booths';

const AREA_NAMES: Record<Area, string> = {
  'mom-baby': 'Mom & Baby Area',
  lifestyle: 'Lifestyle Area',
  fnb: 'F&B Area',
};

export default function BookingPage() {
  const { boothId } = useParams<{ boothId: string }>();
  const navigate = useNavigate();
  const booth = allBooths.find(b => b.id === boothId);

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!booth) return;
    fetch('/api/booked-booths')
      .then(r => r.json())
      .then((ids: string[]) => {
        if (ids.includes(booth.id)) navigate('/', { replace: true });
      })
      .catch(() => {});
  }, [booth, navigate]);

  if (!booth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Booth not found</div>
          <button onClick={() => navigate('/')} className="text-pink-600 underline">Go back</button>
        </div>
      </div>
    );
  }

  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setReceipt(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setReceiptPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!receipt) { setError('Please upload your payment receipt.'); return; }
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('boothId', booth!.id);
    data.append('boothName', booth!.label);
    data.append('price', String(booth!.price));
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('phone', form.phone);
    data.append('company', form.company);
    data.append('receipt', receipt);

    try {
      const res = await fetch('/api/bookings', { method: 'POST', body: data });
      if (res.status === 409) { setError('This booth was just booked by someone else. Please select another.'); return; }
      if (!res.ok) { setError('Booking failed. Please try again.'); return; }
      navigate('/booking-success', { state: { booth: booth!, form } });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(`/map/${booth.area}`)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Map
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Booth Summary */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="text-sm opacity-80 mb-1">{AREA_NAMES[booth.area]} · Block {booth.block}</div>
          <div className="text-3xl font-black mb-1">{booth.label}</div>
          <div className="text-xl font-bold">{formatPrice(booth.price)}</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-gray-800">Tenant Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              required
              type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
            <input
              required
              type="tel"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="+62 812 3456 7890"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Company Name</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Your brand or company"
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            />
          </div>

          {/* Payment Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="font-semibold text-amber-800 mb-1">Payment Instructions</div>
            <div className="text-sm text-amber-700">
              Please transfer <strong>{formatPrice(booth.price)}</strong> to:<br />
              Bank BCA — 1234567890 — PT MBEX INDONESIA<br />
              Use reference: <strong>{booth.id}</strong>
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Receipt *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-pink-400 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleReceiptChange}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                {receiptPreview ? (
                  <div>
                    <img src={receiptPreview} alt="Receipt preview" className="max-h-40 mx-auto rounded-lg mb-2 object-contain" />
                    <div className="text-sm text-pink-600 font-medium">{receipt?.name}</div>
                    <div className="text-xs text-gray-400 mt-1">Click to change</div>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="text-3xl mb-2">📎</div>
                    <div className="font-medium text-gray-600">Click to upload receipt</div>
                    <div className="text-xs text-gray-400 mt-1">JPG, PNG, or PDF · Max 10MB</div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-lg shadow-md"
          >
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>

          <p className="text-xs text-center text-gray-400">
            Your booking will be reviewed by our team. We'll contact you via email/WhatsApp to confirm.
          </p>
        </form>
      </div>
    </div>
  );
}
