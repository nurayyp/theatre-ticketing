const venueEl = document.getElementById('venue');
const vp = document.getElementById('viewport');
const detailsEl = document.getElementById('details');
const cartListEl = document.getElementById('cart-list');
const totalEl = document.getElementById('total');

const STORAGE_KEY = 'theatre-cart-v1';
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

function buildLabels() {
  SECTIONS.forEach(sec => {
    const l = document.createElement('div');
    l.className = 'sec-label';
    l.textContent = `${sec.name} · ${CATEGORIES[sec.category].price} ₼`;
    l.style.left = sec.x + 'px';
    l.style.top = (sec.y - 22) + 'px';
    venueEl.appendChild(l);
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
  document.getElementById('add-btn').addEventListener('click', addToCart);
}

function addToCart() {
  const s = seats.get(inspectedId);
  if (!s || s.unavailable || cart.includes(s.id)) return;
  cart.push(s.id);
  refreshSeat(s);
  renderCart();
  renderDetails();
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x !== id);
  refreshSeat(seats.get(id));
  renderCart();
  renderDetails();
  saveCart();
}

document.getElementById('clear-cart').addEventListener('click', () => {
  const old = [...cart];
  cart = [];
  old.forEach(id => refreshSeat(seats.get(id)));
  renderCart();
  renderDetails();
  saveCart();
});

function renderCart() {
  cartListEl.innerHTML = '';
  if (!cart.length) {
    cartListEl.innerHTML = '<li>Cart is empty</li>';
  }
  cart.forEach(id => {
    const s = seats.get(id);
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = `${s.section} ${s.row}${s.number} — ${s.price} ₼`;
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.textContent = '✕';
    rm.setAttribute('aria-label', `Remove ${s.id}`);
    rm.addEventListener('click', () => removeFromCart(id));
    li.append(label, rm);
    cartListEl.appendChild(li);
  });
  totalEl.textContent = cart.reduce((sum, id) => sum + seats.get(id).price, 0);
}

function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
}

function loadCart() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    cart = ids.filter((id, i) =>
      seats.has(id) && !seats.get(id).unavailable && ids.indexOf(id) === i);
  } catch { cart = []; }
  cart.forEach(id => refreshSeat(seats.get(id)));
}

venueEl.addEventListener('click', e => {
  const b = e.target.closest('.seat');
  if (b) inspect(b.dataset.id);
});

const view = { x: 0, y: 0, s: 1 };
const MIN_ZOOM = 0.4, MAX_ZOOM = 2.5, PAN = 60, MARGIN = 80;

function applyView() {
  const w = VENUE_W * view.s, h = VENUE_H * view.s;
  view.x = Math.min(vp.clientWidth - MARGIN, Math.max(MARGIN - w, view.x));
  view.y = Math.min(vp.clientHeight - MARGIN, Math.max(MARGIN - h, view.y));
  venueEl.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.s})`;
}

function zoomAt(f, cx, cy) {
  const ns = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.s * f));
  const k = ns / view.s;
  view.x = cx - (cx - view.x) * k;
  view.y = cy - (cy - view.y) * k;
  view.s = ns;
  applyView();
}

const zoomCenter = f => zoomAt(f, vp.clientWidth / 2, vp.clientHeight / 2);
function pan(dx, dy) { view.x += dx; view.y += dy; applyView(); }

function resetView() {
  view.s = Math.min(1, vp.clientWidth / VENUE_W, vp.clientHeight / VENUE_H);
  view.x = (vp.clientWidth - VENUE_W * view.s) / 2;
  view.y = (vp.clientHeight - VENUE_H * view.s) / 2;
  applyView();
}

const actions = {
  'zoom-in': () => zoomCenter(1.2),
  'zoom-out': () => zoomCenter(1 / 1.2),
  up: () => pan(0, PAN),
  down: () => pan(0, -PAN),
  left: () => pan(PAN, 0),
  right: () => pan(-PAN, 0),
  reset: resetView
};

document.querySelector('.controls').addEventListener('click', e => {
  const a = e.target.closest('[data-action]');
  if (a) actions[a.dataset.action]();
});
window.addEventListener('resize', applyView);

buildSeats();
buildLabels();
loadCart();
renderCart();
renderDetails();
resetView();