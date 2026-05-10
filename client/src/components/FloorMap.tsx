import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Booth, Area } from '../data/booths';
import { formatPrice } from '../data/booths';

interface Props {
  booths: Booth[];
  area: Area;
}

const AREA_COLORS: Record<Area, { available: string; booked: string; hover: string; selected: string; text: string; accent: string }> = {
  'mom-baby': { available: '#bbf7d0', booked: '#fca5a5', hover: '#86efac', selected: '#16a34a', text: '#15803d', accent: '#dcfce7' },
  lifestyle:  { available: '#fbcfe8', booked: '#fca5a5', hover: '#f9a8d4', selected: '#db2777', text: '#9d174d', accent: '#fce7f3' },
  fnb:        { available: '#fed7aa', booked: '#fca5a5', hover: '#fdba74', selected: '#ea580c', text: '#9a3412', accent: '#ffedd5' },
};

export default function FloorMap({ booths, area }: Props) {
  const navigate = useNavigate();
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const colors = AREA_COLORS[area];

  useEffect(() => {
    fetch('/api/booked-booths')
      .then(r => r.json())
      .then((ids: string[]) => setBookedIds(new Set(ids)))
      .catch(() => {});
  }, []);

  const minX = Math.min(...booths.map(b => b.x));
  const minY = Math.min(...booths.map(b => b.y));
  const maxX = Math.max(...booths.map(b => b.x + b.width));
  const maxY = Math.max(...booths.map(b => b.y + b.height));
  const PAD = 20;
  const vbW = maxX - minX + PAD * 2;
  const vbH = maxY - minY + PAD * 2;

  const selectedBooths = booths.filter(b => selectedIds.has(b.id));
  const totalPrice = selectedBooths.reduce((sum, b) => sum + b.price, 0);

  function getFill(b: Booth) {
    if (bookedIds.has(b.id)) return colors.booked;
    if (selectedIds.has(b.id)) return colors.selected;
    if (hovered === b.id) return colors.hover;
    return colors.available;
  }

  function handleClick(b: Booth) {
    if (bookedIds.has(b.id)) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(b.id)) next.delete(b.id);
      else next.add(b.id);
      return next;
    });
  }

  function handleBook() {
    navigate('/book', { state: { booths: selectedBooths } });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex gap-4 text-sm flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded" style={{ background: colors.available, border: '1px solid #ccc' }} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded" style={{ background: colors.booked, border: '1px solid #ccc' }} />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded" style={{ background: colors.selected, border: '1px solid #ccc' }} />
          Selected
        </span>
        <span className="text-gray-400 text-xs ml-auto">Click booths to select — you can pick multiple</span>
      </div>

      {/* SVG Map */}
      <div className="overflow-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
        <svg
          viewBox={`${minX - PAD} ${minY - PAD} ${vbW} ${vbH}`}
          className="w-full"
          style={{ minWidth: Math.min(vbW * 1.2, 1000), maxHeight: 620 }}
        >
          {booths.map((b) => {
            const isBooked = bookedIds.has(b.id);
            const isSelected = selectedIds.has(b.id);
            return (
              <g
                key={b.id}
                onClick={() => handleClick(b)}
                onMouseEnter={() => !isBooked && setHovered(b.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
              >
                <rect
                  x={b.x} y={b.y} width={b.width} height={b.height}
                  fill={getFill(b)}
                  stroke={isSelected ? colors.selected : '#999'}
                  strokeWidth={isSelected ? 2 : 1}
                  rx={3}
                />
                <text
                  x={b.x + b.width / 2}
                  y={b.y + b.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={b.width > 60 ? 10 : 7}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill={isSelected ? 'white' : isBooked ? '#666' : '#222'}
                >
                  {b.label}
                </text>
                {isBooked && (
                  <line
                    x1={b.x + 2} y1={b.y + 2}
                    x2={b.x + b.width - 2} y2={b.y + b.height - 2}
                    stroke="#ef4444" strokeWidth={1} opacity={0.5}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cart Panel */}
      {selectedBooths.length > 0 && (
        <div className="bg-white border-2 rounded-xl p-5 shadow-lg" style={{ borderColor: colors.selected }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Selected Booths ({selectedBooths.length})
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedBooths.map(b => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium text-white"
                    style={{ background: colors.selected }}
                  >
                    {b.label}
                    <button
                      onClick={() => handleClick(b)}
                      className="ml-1 opacity-70 hover:opacity-100 font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-lg font-bold" style={{ color: colors.text }}>
                Total: {formatPrice(totalPrice)}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleBook}
                className="px-6 py-3 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-opacity text-sm"
                style={{ background: `linear-gradient(135deg, ${colors.selected}, ${colors.text})` }}
              >
                Book {selectedBooths.length} Booth{selectedBooths.length > 1 ? 's' : ''} →
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-6 py-2 text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
