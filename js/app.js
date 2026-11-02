const venueEl = document.getElementById('venue');
const detailsEl = document.getElementById('details');
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

function inspect(id) {
  const prev = inspectedId;
  inspectedId = id;
  if (prev) refreshSeat(seats.get(prev));
  refreshSeat(seats.get(id));
  renderDetails();
}

function renderDetails() {
  const s = seats.get(inspectedId);
  if (!s) {
    detailsEl.innerHTML = '<h2>Seat details</h2><p>Select a seat on the map.</p>';
    return;
  }
  const inCart = cart.includes(s.id);
  const status = s.unavailable ? 'Unavailable' : inCart ? 'In your cart' : 'Available';
  detailsEl.innerHTML = `
    <h2>Seat details</h2>
    <p><b>Section:</b> ${s.section}</p>
    <p><b>Row / Seat:</b> ${s.row} / ${s.number}</p>
    <p><b>Category:</b> ${s.category}</p>
    <p><b>Price:</b> ${s.price} ₼</p>
    <p><b>Status:</b> ${status}</p>
    <button type="button" id="add-btn" ${s.unavailable || inCart ? 'disabled' : ''}>
      ${inCart ? 'Already in cart' : s.unavailable ? 'Unavailable' : 'ADD TO CART'}</button>`;
}

venueEl.addEventListener('click', e => {
  const b = e.target.closest('.seat');
  if (b) inspect(b.dataset.id);
});

buildSeats();
renderDetails();