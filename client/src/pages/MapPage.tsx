import { useNavigate, useParams } from 'react-router-dom';
import FloorMap from '../components/FloorMap';
import { momBabyBooths, fnbBooths, lifestyleBooths } from '../data/booths';
import type { Area, Booth } from '../data/booths';

const AREA_META: Record<Area, { name: string; booths: Booth[]; color: string; emoji: string }> = {
  'mom-baby': { name: 'Mom & Baby Area', booths: momBabyBooths, color: 'green', emoji: '🍼' },
  lifestyle: { name: 'Lifestyle Area', booths: lifestyleBooths, color: 'pink', emoji: '✨' },
  fnb: { name: 'F&B Area', booths: fnbBooths, color: 'orange', emoji: '🍽️' },
};

const OTHER_AREAS: { id: Area; label: string }[] = [
  { id: 'mom-baby', label: '🍼 Mom & Baby' },
  { id: 'lifestyle', label: '✨ Lifestyle' },
  { id: 'fnb', label: '🍽️ F&B' },
];

export default function MapPage() {
  const { area } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const meta = AREA_META[area as Area];

  if (!meta) {
    return <div className="p-8 text-center">Unknown area. <button onClick={() => navigate('/')} className="underline">Go back</button></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            ← Back
          </button>
          <div className="font-bold text-gray-800">{meta.emoji} {meta.name}</div>
          <div className="flex gap-2">
            {OTHER_AREAS.filter(a => a.id !== area).map(a => (
              <button
                key={a.id}
                onClick={() => navigate(`/map/${a.id}`)}
                className="text-xs border border-gray-300 px-2 py-1 rounded-lg hover:bg-gray-50"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{meta.name} — Floor Map</h1>
          <p className="text-gray-500 text-sm">Click on a booth to select it, then click "Book This Booth" to proceed.</p>
        </div>

        <FloorMap booths={meta.booths} area={area as Area} />

        {/* Price Table */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Price Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Booth</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  meta.booths.reduce<Record<string, string[]>>((acc, booth) => {
                    const key = `${booth.price}`;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(booth.label);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([price, labels]) => {
                    const lbl = labels as string[];
                    return (
                    <tr key={price} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 text-gray-700">
                        {lbl.length > 8
                          ? `${lbl[0]} – ${lbl[lbl.length - 1]} (${lbl.length} booths)`
                          : lbl.join(', ')}
                      </td>
                      <td className="py-2 text-right font-semibold text-gray-800">
                        Rp {Number(price).toLocaleString('id-ID')},-
                      </td>
                    </tr>
                  );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
