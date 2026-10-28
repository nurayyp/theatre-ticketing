const CATEGORIES = {
  vip:      { name: 'VIP',      price: 180, color: '#c0392b' },
  standard: { name: 'Standard', price: 130, color: '#2980b9' },
  economy:  { name: 'Economy',  price: 80,  color: '#8e44ad' }
};

const SEAT_SIZE = 28, GAP = 6, STEP = SEAT_SIZE + GAP;
const VENUE_W = 880, VENUE_H = 500;

const SECTIONS = [
  { id: 'L', name: 'Left Orchestra',  category: 'standard', rows: 5, cols: 6,  x: 30,  y: 110 },
  { id: 'C', name: 'Center Front',    category: 'vip',      rows: 5, cols: 10, x: 270, y: 110 },
  { id: 'R', name: 'Right Orchestra', category: 'standard', rows: 5, cols: 6,  x: 646, y: 110 },
  { id: 'B', name: 'Balcony',         category: 'economy',  rows: 4, cols: 24, x: 30,  y: 330 }
];