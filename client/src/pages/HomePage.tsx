import { useNavigate } from 'react-router-dom';

const areas = [
  {
    id: 'mom-baby',
    name: 'Mom & Baby Area',
    description: 'Blocks A, B, C, D, E — Starting from Rp 12.000.000,-',
    color: 'from-green-400 to-green-600',
    icon: '🍼',
    bg: 'bg-green-50',
    border: 'border-green-400',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Area',
    description: 'Blocks L, H, E4X — Starting from Rp 10.000.000,-',
    color: 'from-pink-400 to-pink-600',
    icon: '✨',
    bg: 'bg-pink-50',
    border: 'border-pink-400',
  },
  {
    id: 'fnb',
    name: 'F&B Area',
    description: 'Block F — Starting from Rp 6.000.000,-',
    color: 'from-orange-400 to-orange-600',
    icon: '🍽️',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-black text-xl px-3 py-1 rounded-lg">
              MBEX
            </div>
            <div>
              <div className="font-bold text-gray-800">Exhibition Booth Booking</div>
              <div className="text-xs text-gray-500">Select your booth today</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-1.5 rounded-lg hover:border-gray-400 transition-colors"
          >
            Exhibitor Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-4xl px-6 py-3 rounded-2xl mb-6 shadow-lg">
          MBEX 2026
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Book Your Exhibition Booth
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Choose your area below to view the interactive floor map and reserve your preferred booth space.
        </p>

        {/* Area Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => navigate(`/map/${area.id}`)}
              className={`${area.bg} border-2 ${area.border} rounded-2xl p-8 text-left hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group`}
            >
              <div className="text-5xl mb-4">{area.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                {area.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{area.description}</p>
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${area.color} text-white text-sm font-semibold px-4 py-2 rounded-full`}>
                View Map →
              </div>
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">How to Book</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Choose Area', desc: 'Select your preferred exhibition area' },
              { step: '2', title: 'Pick a Booth', desc: 'Click on an available booth on the map' },
              { step: '3', title: 'Fill Details', desc: 'Enter your contact & company info' },
              { step: '4', title: 'Upload Receipt', desc: 'Upload payment proof to confirm' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <div className="font-semibold text-gray-700 mb-1">{title}</div>
                <div className="text-sm text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-gray-400 py-8">
        © 2026 MBEX Exhibition. All rights reserved.
      </footer>
    </div>
  );
}
