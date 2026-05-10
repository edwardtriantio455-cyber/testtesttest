export type Area = 'mom-baby' | 'lifestyle' | 'fnb';

export interface Booth {
  id: string;
  label: string;
  area: Area;
  block: string;
  price: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const CELL = 36;
const GAP = 2;
const S = CELL + GAP; // step size

function b(
  id: string, label: string, area: Area, block: string, price: number,
  col: number, row: number, cols = 1, rows = 1
): Booth {
  return {
    id, label, area, block, price,
    x: col * S, y: row * S,
    width: cols * CELL + (cols - 1) * GAP,
    height: rows * CELL + (rows - 1) * GAP,
  };
}

// ─── MOM & BABY ─────────────────────────────────────────────────────────────

export const momBabyBooths: Booth[] = [
  // Block A – 12M – outer perimeter
  b('A1','A1','mom-baby','A',12000000, 12, 0),
  b('A2','A2','mom-baby','A',12000000, 11, 0),
  b('A3','A3','mom-baby','A',12000000, 10, 0),
  b('A4','A4','mom-baby','A',12000000, 0, 1),
  b('A5','A5','mom-baby','A',12000000, 0, 2),
  b('A6','A6','mom-baby','A',12000000, 0, 3),
  b('A7','A7','mom-baby','A',12000000, 0, 4),
  b('A8','A8','mom-baby','A',12000000, 0, 5),
  b('A9','A9','mom-baby','A',12000000, 0, 6),
  b('A10','A10','mom-baby','A',12000000, 0, 7),
  b('A11','A11','mom-baby','A',12000000, 0, 8),
  b('A12','A12','mom-baby','A',12000000, 0, 9),
  b('A13','A13','mom-baby','A',12000000, 0, 10),
  b('A14','A14','mom-baby','A',12000000, 0, 11),
  b('A15','A15','mom-baby','A',12000000, 1, 12),
  b('A16','A16','mom-baby','A',12000000, 2, 12),
  b('A17','A17','mom-baby','A',12000000, 3, 12),
  b('A18','A18','mom-baby','A',12000000, 4, 12),
  b('A19','A19','mom-baby','A',12000000, 5, 12),
  b('A20','A20','mom-baby','A',12000000, 21, 0),
  b('A21','A21','mom-baby','A',12000000, 22, 0),
  b('A22','A22','mom-baby','A',12000000, 23, 0),
  b('A23','A23','mom-baby','A',12000000, 24, 1),
  b('A24','A24','mom-baby','A',12000000, 24, 2),
  b('A25','A25','mom-baby','A',12000000, 24, 3),
  b('A26','A26','mom-baby','A',12000000, 24, 4),
  b('A27','A27','mom-baby','A',12000000, 24, 5),
  b('A28','A28','mom-baby','A',12000000, 24, 6),
  b('A29','A29','mom-baby','A',12000000, 24, 8),
  b('A30','A30','mom-baby','A',12000000, 24, 9),
  b('A31','A31','mom-baby','A',12000000, 24, 10),
  b('A32','A32','mom-baby','A',12000000, 23, 12),
  b('A33','A33','mom-baby','A',12000000, 22, 12),
  b('A34','A34','mom-baby','A',12000000, 21, 12),
  b('A35','A35','mom-baby','A',12000000, 20, 12),
  b('A36','A36','mom-baby','A',12000000, 19, 12),
  b('A37','A37','mom-baby','A',12000000, 18, 12),

  // Block B – 14M – inner side columns
  b('B1','B1','mom-baby','B',14000000, 2, 2),
  b('B7','B7','mom-baby','B',14000000, 3, 2),
  b('B2','B2','mom-baby','B',14000000, 2, 3),
  b('B8','B8','mom-baby','B',14000000, 3, 3),
  b('B3','B3','mom-baby','B',14000000, 2, 5),
  b('B9','B9','mom-baby','B',14000000, 3, 5),
  b('B4','B4','mom-baby','B',14000000, 2, 6),
  b('B10','B10','mom-baby','B',14000000, 3, 6),
  b('B5','B5','mom-baby','B',14000000, 2, 9),
  b('B11','B11','mom-baby','B',14000000, 3, 9),
  b('B6','B6','mom-baby','B',14000000, 2, 10),
  b('B12','B12','mom-baby','B',14000000, 3, 10),
  b('B13','B13','mom-baby','B',14000000, 19, 2),
  b('B19','B19','mom-baby','B',14000000, 20, 2),
  b('B14','B14','mom-baby','B',14000000, 19, 3),
  b('B20','B20','mom-baby','B',14000000, 20, 3),
  b('B15','B15','mom-baby','B',14000000, 19, 5),
  b('B21','B21','mom-baby','B',14000000, 20, 5),
  b('B16','B16','mom-baby','B',14000000, 19, 6),
  b('B22','B22','mom-baby','B',14000000, 20, 6),
  b('B17','B17','mom-baby','B',14000000, 19, 8),
  b('B23','B23','mom-baby','B',14000000, 20, 8),
  b('B18','B18','mom-baby','B',14000000, 19, 9),
  b('B24','B24','mom-baby','B',14000000, 20, 9),

  // Block C – variable
  b('C1','C1','mom-baby','C',15000000, 5, 2),
  b('C2','C2','mom-baby','C',15000000, 5, 3),
  b('C3','C3','mom-baby','C',15000000, 5, 5),
  b('C4','C4','mom-baby','C',15000000, 5, 6),
  b('C5','C5','mom-baby','C',20000000, 5, 9),
  b('C6','C6','mom-baby','C',20000000, 5, 10),
  b('C7','C7','mom-baby','C',15000000, 14, 2),
  b('C8','C8','mom-baby','C',15000000, 14, 3),
  b('C9','C9','mom-baby','C',15000000, 14, 5),
  b('C10','C10','mom-baby','C',15000000, 14, 6),
  b('C11','C11','mom-baby','C',20000000, 14, 8),
  b('C12','C12','mom-baby','C',20000000, 14, 9),
  b('C13','C13','mom-baby','C',15000000, 14, 10),
  b('C14','C14','mom-baby','C',15000000, 14, 11),

  // Block D – variable
  b('D1','D1','mom-baby','D',15000000, 6, 2),
  b('D2','D2','mom-baby','D',15000000, 6, 3),
  b('D3','D3','mom-baby','D',15000000, 6, 5),
  b('D4','D4','mom-baby','D',15000000, 6, 6),
  b('D5','D5','mom-baby','D',20000000, 6, 9),
  b('D6','D6','mom-baby','D',20000000, 6, 10),
  b('D7','D7','mom-baby','D',15000000, 13, 2),
  b('D8','D8','mom-baby','D',15000000, 13, 3),
  b('D9','D9','mom-baby','D',15000000, 13, 5),
  b('D10','D10','mom-baby','D',15000000, 13, 6),
  b('D11','D11','mom-baby','D',20000000, 13, 8),
  b('D12','D12','mom-baby','D',20000000, 13, 9),
  b('D13','D13','mom-baby','D',15000000, 13, 10),
  b('D14','D14','mom-baby','D',15000000, 13, 11),

  // Block E – large booths
  { id:'E1',  label:'E1',  area:'mom-baby', block:'E', price:70000000, x:7*S, y:2*S, width:4*CELL+3*GAP, height:4*CELL+3*GAP },
  { id:'E2',  label:'E2',  area:'mom-baby', block:'E', price:70000000, x:7*S, y:7*S, width:4*CELL+3*GAP, height:4*CELL+3*GAP },
  { id:'E3X', label:'E3X', area:'mom-baby', block:'E', price:90000000, x:7*S, y:7*S, width:4*CELL+3*GAP, height:3*CELL+2*GAP },
];

// ─── F&B ─────────────────────────────────────────────────────────────────────

export const fnbBooths: Booth[] = [
  // Top row
  b('F1','F1','fnb','F',6000000, 0,0),
  b('F2','F2','fnb','F',6000000, 1,0),
  b('F3','F3','fnb','F',6000000, 2,0),
  b('F4','F4','fnb','F',6000000, 3,0),
  // Right column F5–F16
  ...Array.from({length:12},(_,i) => b(`F${5+i}`,`F${5+i}`,'fnb','F',6000000, 4, i+1)),
  // Left column F17–F32
  ...Array.from({length:16},(_,i) => b(`F${17+i}`,`F${17+i}`,'fnb','F',6000000, 0, i+1)),
  // Inner clusters
  b('F33','F33','fnb','F',6000000, 2,4),
  b('F34','F34','fnb','F',6000000, 3,4),
  b('F35','F35','fnb','F',6000000, 2,5),
  b('F36','F36','fnb','F',6000000, 3,5),
  b('F37','F37','fnb','F',6000000, 2,10),
  b('F38','F38','fnb','F',6000000, 3,10),
  b('F39','F39','fnb','F',6000000, 2,11),
  b('F40','F40','fnb','F',6000000, 3,11),
  b('F41','F41','fnb','F',6000000, 2,15),
  b('F42','F42','fnb','F',6000000, 3,15),
  b('F43','F43','fnb','F',6000000, 1,13),
  b('F44','F44','fnb','F',6000000, 2,13),
  b('F45','F45','fnb','F',6000000, 3,13),
  b('F46','F46','fnb','F',6000000, 1,14),
  b('F47','F47','fnb','F',6000000, 2,14),
  b('F48','F48','fnb','F',6000000, 3,14),
  b('F49','F49','fnb','F',6000000, 2,16),
  b('F50','F50','fnb','F',6000000, 3,16),
];

// ─── LIFESTYLE ────────────────────────────────────────────────────────────────

export const lifestyleBooths: Booth[] = [
  // Block L – top row (L13 left → L1 right)
  b('L13','L13','lifestyle','L',10000000, 0,0),
  b('L12','L12','lifestyle','L',10000000, 1,0),
  b('L11','L11','lifestyle','L',10000000, 2,0),
  b('L10*','L10*','lifestyle','L',18000000, 3,0),
  b('L9*','L9*','lifestyle','L',18000000, 4,0),
  b('L8','L8','lifestyle','L',10000000, 5,0),
  b('L7','L7','lifestyle','L',10000000, 6,0),
  b('L6','L6','lifestyle','L',10000000, 7,0),
  b('L5','L5','lifestyle','L',10000000, 8,0),
  b('L4','L4','lifestyle','L',10000000, 9,0),
  b('L3','L3','lifestyle','L',10000000, 10,0),
  b('L2','L2','lifestyle','L',10000000, 11,0),
  b('L1','L1','lifestyle','L',10000000, 12,0),

  // Row 2
  b('L14','L14','lifestyle','L',10000000, 0,1),
  b('L15','L15','lifestyle','L',10000000, 0,2),
  b('L16','L16','lifestyle','L',10000000, 1,1),
  b('L17','L17','lifestyle','L',10000000, 5,1),
  b('L18','L18','lifestyle','L',10000000, 7,1),
  b('L19','L19','lifestyle','L',10000000, 8,1),
  b('L20','L20','lifestyle','L',10000000, 10,1),
  b('L21','L21','lifestyle','L',10000000, 11,1),
  b('L22','L22','lifestyle','L',10000000, 13,1),
  b('L23','L23','lifestyle','L',10000000, 14,1),

  // Block H – starred (18M)
  b('H1*','H1*','lifestyle','H',18000000, 2,1),
  b('H2*','H2*','lifestyle','H',18000000, 4,1),
  b('H3*','H3*','lifestyle','H',18000000, 2,2),
  b('H4*','H4*','lifestyle','H',18000000, 3,2),
  b('H5*','H5*','lifestyle','H',18000000, 4,2),
  b('H6*','H6*','lifestyle','H',18000000, 3,1),

  // Block H – regular (10M)
  b('H7','H7','lifestyle','H',10000000, 5,2),
  b('H8','H8','lifestyle','H',10000000, 6,2),
  b('H9','H9','lifestyle','H',10000000, 9,2),
  b('H10','H10','lifestyle','H',10000000, 10,2),
  b('H11','H11','lifestyle','H',10000000, 13,2),
  b('H12','H12','lifestyle','H',10000000, 14,2),
  b('H13','H13','lifestyle','H',10000000, 7,3),
  b('H14','H14','lifestyle','H',10000000, 8,3),
  b('H15','H15','lifestyle','H',10000000, 9,3),
  b('H16','H16','lifestyle','H',10000000, 10,3),
  b('H17','H17','lifestyle','H',10000000, 11,3),

  // E4X large
  { id:'E4X', label:'E4X', area:'lifestyle', block:'E', price:30000000, x:4*S, y:3*S, width:3*CELL+2*GAP, height:2*CELL+GAP },
];

export const allBooths: Booth[] = [...momBabyBooths, ...fnbBooths, ...lifestyleBooths];

export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')},-`;
}
