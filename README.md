# Nour Theatre Ticketing

Interactive venue ticketing system (Web & Mobile I project).
Built with HTML, CSS and JavaScript.

## Venue
Theatre/auditorium with a stage, four sections and three price categories.

| Section         | Category | Price | Layout   |
|-----------------|----------|-------|----------|
| Center Front    | VIP      | 180 ₼ | 5 × 10   |
| Left Orchestra  | Standard | 130 ₼ | 5 × 6    |
| Right Orchestra | Standard | 130 ₼ | 5 × 6    |
| Balcony         | Economy  | 80 ₼  | 4 × 24   |

Total: 206 seats.

## Features
- Seats generated from JavaScript data (206 seats, 4 sections, 3 price tiers)
- Seat inspection with details and price; only ADD TO CART adds a ticket
- Seat states: available, inspected, in cart, unavailable
- Zoom in/out, move up/down/left/right, reset view
- Mouse wheel zoom and click-drag panning (bonus)
- Cart with total, ticket removal and duplicate prevention
- Cart saved in localStorage and restored after refresh
- Responsive layout for tablet and phone

## Run
Open `index.html` in a browser. No build step is needed.