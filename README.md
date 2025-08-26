
# Rewards Program - Vanilla JavaScript

This project implements the rewards program described in the specification.

## Run (static server)
1. Install dev dependencies (optional for tests):
   ```bash
   npm install
   ```
2. Start a static server (or use built-in script):
   ```bash
   npm run start
   ```
   Open http://localhost:3000 in your browser.

## Tests
```bash
npm install
npm test
```

## Notes
- All static data is in `public/data/transactions.json`.
- Points are computed dynamically in JS (not stored in JSON).
- Default filters show the most recent 3 months for selected customer.
