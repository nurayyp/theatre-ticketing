const venueEl = document.getElementById('venue');
const seats = new Map();
let inspectedId = null;
let cart = [];

const isUnavailable = (si, r, c) => (si * 5 + r * 7 + c * 3) % 11 === 0;

function buildSeats() {
  SECTIONS.forEach((sec, si) => {
    const cat = CATEGORIES[sec.category];
    for (let r = 0; r < sec.rows; r++) {
      for (let c = 0; c < sec.cols; c++) {
        const row = String.fromCharCode(65 + r);
        const seat = {
          id: `${sec.id}-${row}${c + 1}`,
          section: sec.name, row, number: c + 1,
          category: cat.name, price: cat.price, color: cat.color,
          unavailable: isUnavailable(si, r, c)
        };
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'seat';
        btn.dataset.id = seat.id;
        btn.textContent = seat.number;
        btn.style.left = sec.x + c * STEP + 'px';
        btn.style.top = sec.y + r * STEP + 'px';
        btn.style.setProperty('--c', seat.color);
        btn.setAttribute('aria-label',
          `${seat.section}, row ${row}, seat ${seat.number}, ${seat.price} AZN`);
        if (seat.unavailable) {
          btn.classList.add('unavailable');
          btn.setAttribute('aria-disabled', 'true');
        }
        seat.el = btn;
        venueEl.appendChild(btn);
        seats.set(seat.id, seat);
      }
    }
  });
}

function refreshSeat(seat) {
  seat.el.classList.toggle('inspected', seat.id === inspectedId);
  seat.el.classList.toggle('in-cart', cart.includes(seat.id));
}

buildSeats();