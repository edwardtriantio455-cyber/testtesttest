import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allBooths, formatPrice } from '../data/booths';

interface Booking {
  id: string;
  boothId: string;
  boothName: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  receiptFile: string | null;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  notes: string;
}

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
};

const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', rejected: 'Rejected' };

const ADMIN_PASSWORD = 'mbex2026';

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'map'>('bookings');

  const boothMap = Object.fromEntries(allBooths.map(b => [b.id, b]));

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else { setPwError('Incorrect password'); }
  }

  async function fetchBookings() {
    setLoading(true);
    try {
      const r = await fetch('/api/bookings');
      setBookings(await r.json());
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { if (authed) fetchBookings(); }, [authed]);

  async function updateStatus(id: string, status: string) {
    setSaving(true);
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    await fetchBookings();
    setSaving(false);
    setSelected(b => b?.id === id ? { ...b!, status: status as Booking['status'], notes } : b);
  }

  async function deleteBooking(id: string) {
    if (!confirm('Delete this booking permanently?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setSelected(null);
    await fetchBookings();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-black text-2xl px-4 py-2 rounded-xl inline-block mb-3">MBEX</div>
            <h1 className="text-xl font-bold text-gray-800">Exhibitor Portal</h1>
            <p className="text-sm text-gray-400">Enter your admin password</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
            />
            {pwError && <div className="text-red-600 text-sm">{pwError}</div>}
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90">
              Login
            </button>
            <button type="button" onClick={() => navigate('/')} className="w-full text-sm text-gray-400 hover:text-gray-600">
              ← Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return b.name.toLowerCase().includes(s) || b.email.toLowerCase().includes(s) ||
        b.boothId.toLowerCase().includes(s) || b.company.toLowerCase().includes(s);
    }
    return true;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.price, 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-black px-3 py-1 rounded-lg text-lg">MBEX</div>
            <div>
              <div className="font-bold text-gray-800">Exhibitor Dashboard</div>
              <div className="text-xs text-gray-400">Booth Management Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => { setAuthed(false); setPw(''); }}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-gray-800' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-500' },
            { label: 'Confirmed Revenue', value: `Rp ${stats.revenue.toLocaleString('id-ID')},-`, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['bookings', 'map'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${activeTab === tab ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'bookings' ? '📋 Bookings' : '🗺️ Booth Map'}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* List */}
            <div className="flex-1 min-w-0">
              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3 flex flex-wrap gap-3 items-center">
                <input
                  className="flex-1 min-w-40 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Search name, email, booth..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <div className="flex gap-1">
                  {(['all', 'pending', 'confirmed', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No bookings found.</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(b => (
                    <button
                      key={b.id}
                      onClick={() => { setSelected(b); setNotes(b.notes); }}
                      className={`w-full bg-white border rounded-xl p-4 text-left hover:shadow-md transition-shadow ${selected?.id === b.id ? 'border-pink-400 ring-2 ring-pink-200' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">{b.boothName}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[b.status]}`}>
                              {STATUS_LABELS[b.status]}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{b.name} {b.company && `· ${b.company}`}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{b.email} · {b.phone}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold text-gray-700 text-sm">{formatPrice(b.price)}</div>
                          <div className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString('id-ID')}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selected && (
              <div className="w-full lg:w-96 bg-white rounded-xl border border-gray-200 p-5 h-fit sticky top-20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{selected.boothName}</div>
                    <div className="text-sm text-gray-400">{boothMap[selected.boothId]?.area} · Block {boothMap[selected.boothId]?.block}</div>
                    <div className="font-semibold text-pink-600 mt-1">{formatPrice(selected.price)}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[selected.status]}`}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div><span className="text-gray-400">Name:</span> <span className="font-medium text-gray-800">{selected.name}</span></div>
                  <div><span className="text-gray-400">Email:</span> <a href={`mailto:${selected.email}`} className="text-pink-600 underline">{selected.email}</a></div>
                  <div><span className="text-gray-400">Phone:</span> <a href={`tel:${selected.phone}`} className="text-pink-600">{selected.phone}</a></div>
                  {selected.company && <div><span className="text-gray-400">Company:</span> <span className="font-medium text-gray-800">{selected.company}</span></div>}
                  <div><span className="text-gray-400">Submitted:</span> {new Date(selected.createdAt).toLocaleString('id-ID')}</div>
                </div>

                {selected.receiptFile && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">Payment Receipt</div>
                    <a
                      href={`/uploads/${selected.receiptFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`/uploads/${selected.receiptFile}`}
                        alt="Receipt"
                        className="w-full rounded-lg border border-gray-200 max-h-48 object-contain hover:opacity-90"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="text-xs text-center text-pink-600 mt-1">📎 {selected.receiptFile}</div>
                    </a>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-1">Admin Notes</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                    rows={3}
                    placeholder="Add notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selected.id, 'confirmed')}
                      disabled={saving || selected.status === 'confirmed'}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
                    >
                      ✓ Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'rejected')}
                      disabled={saving || selected.status === 'rejected'}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                  <button
                    onClick={() => updateStatus(selected.id, 'pending')}
                    disabled={saving || selected.status === 'pending'}
                    className="w-full border border-amber-400 text-amber-600 font-medium py-2 rounded-xl text-sm hover:bg-amber-50 disabled:opacity-50"
                  >
                    Reset to Pending
                  </button>
                  <button
                    onClick={() => deleteBooking(selected.id)}
                    className="w-full text-xs text-red-400 hover:text-red-600 py-1"
                  >
                    Delete Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">All Booths Status Overview</h2>
            <div className="flex gap-4 text-sm mb-4 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-200 border border-green-400" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-300 border border-amber-500" /> Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-300 border border-red-500" /> Confirmed</span>
            </div>

            {(['mom-baby', 'lifestyle', 'fnb'] as const).map(areaId => {
              const areaName = { 'mom-baby': 'Mom & Baby Area', lifestyle: 'Lifestyle Area', fnb: 'F&B Area' }[areaId];
              const areaBooths = allBooths.filter(b => b.area === areaId);
              return (
                <div key={areaId} className="mb-8">
                  <h3 className="font-semibold text-gray-700 mb-2">{areaName}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {areaBooths.map(b => {
                      const booking = bookings.find(bk => bk.boothId === b.id && bk.status !== 'rejected');
                      let bg = 'bg-green-100 border-green-300 text-green-800';
                      if (booking?.status === 'pending') bg = 'bg-amber-100 border-amber-400 text-amber-800';
                      if (booking?.status === 'confirmed') bg = 'bg-red-100 border-red-400 text-red-800';
                      return (
                        <button
                          key={b.id}
                          title={booking ? `${b.label}: ${booking.name} (${booking.status})` : `${b.label}: Available`}
                          onClick={() => {
                            if (booking) { setSelected(booking); setNotes(booking.notes); setActiveTab('bookings'); }
                          }}
                          className={`text-xs font-medium px-2 py-1 rounded border ${bg} ${booking ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
