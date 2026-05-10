import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Booth, Area } from '../data/booths';
import { formatPrice } from '../data/booths';

interface Props {
  booths: Booth[];
  area: Area;
}

const AREA_COLORS: Record<Area, { available: string; booked: string; hover: string; selected: string; text: string }> = {
  'mom-baby': {
    available: '#bbf7d0',
    booked: '#fca5a5',
    hover: '#86efac',
    selected: '#16a34a',
    text: '#15803d',
  },
  lifestyle: {
    available: '#fbcfe8',
    booked: '#fca5a5',
    hover: '#f9a8d4',
    selected: '#db2777',
    text: '#9d174d',
  },
  fnb: {
    available: '#fed7aa',
    booked: '#fca5a5',
    hover: '#fdba74',
    selected: '#ea580c',
    text: '#9a3412',
  },
};

export default function FloorMap({ booths, area }: Props) {
  const navigate = useNavigate();
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booth | null>(null);
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

  function getFill(b: Booth) {
    if (bookedIds.has(b.id)) return colors.booked;
    if (selected?.id === b.id) return colors.selected;
    if (hovered === b.id) return colors.hover;
    return colors.available;
  }

  function handleClick(b: Booth) {
    if (bookedIds.has(b.id)) return;
    if (selected?.id === b.id) {
      setSelected(null);
    } else {
      setSelected(b);
    }
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
      </div>

      {/* SVG Map */}
      <div className="overflow-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
        <svg
          viewBox={`${minX - PAD} ${minY - PAD} ${vbW} ${vbH}`}
          className="w-full"
          style={{ minWidth: Math.min(vbW * 1.2, 900), maxHeight: 600 }}
        >
          {booths.map((b) => {
            const isBooked = bookedIds.has(b.id);
            return (
              <g
                key={b.id}
                onClick={() => handleClick(b)}
                onMouseEnter={() => !isBooked && setHovered(b.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.width}
                  height={b.height}
                  fill={getFill(b)}
                  stroke={selected?.id === b.id ? colors.selected : '#999'}
                  strokeWidth={selected?.id === b.id ? 2 : 1}
                  rx={3}
                />
                <text
                  x={b.x + b.width / 2}
                  y={b.y + b.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={b.width > 60 ? 10 : 7}
                  fontWeight={selected?.id === b.id ? 'bold' : 'normal'}
                  fill={selected?.id === b.id ? 'white' : isBooked ? '#666' : '#222'}
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

      {/* Selection Panel */}
      {selected && (
        <div className="bg-white border-2 rounded-xl p-5 shadow-lg" style={{ borderColor: colors.selected }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Selected Booth</div>
              <div className="text-2xl font-bold text-gray-800">{selected.label}</div>
              <div className="text-sm text-gray-500">Block {selected.block}</div>
              <div className="text-lg font-bold mt-2" style={{ color: colors.text }}>
                {formatPrice(selected.price)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/book/${selected.id}`)}
                className="px-6 py-3 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${colors.selected}, ${colors.text})` }}
              >
                Book This Booth →
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-6 py-2 text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-50 text-sm"
              >
                Deselect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
