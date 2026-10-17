# PizzaNee Frontend 🍕

A reconstructed React frontend for PizzaNee, the pizza-ordering portfolio project. This ZIP contains only the frontend; it expects the existing Express API and MongoDB/Stripe backend to run separately.

## Requirements

- Node.js 18 or newer (Node 20 LTS recommended)
- npm
- The PizzaNee backend for database-backed pizzas and Stripe Checkout

## Run locally

1. Extract this ZIP.
2. Open a terminal inside the extracted `PizzaNee-frontend` folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and set the backend URL:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. Start the frontend:

   ```bash
   npm start
   ```

The site opens at `http://localhost:3000`.

## Backend integration

The frontend expects these API endpoints:

- `GET /api/pizzas` — returns an array of pizza records, or an object containing `pizzas`, `data`, or `items`.
- `POST /api/payments/create-checkout-session` — accepts `items` containing standard `{ type: "standard", pizzaId, quantity }` entries and custom `{ type: "custom", customization, quantity }` entries; returns `{ url }`.
- `GET /api/payments/verify-session/:sessionId` — returns payment/order state, including `paymentStatus`, `orderId`, and `totalAmount`.

Standard database pizza records should have `_id`, `name`, `price`, and optionally `image`, `description`, `isVeg`, and `category`. If the API cannot be reached, the UI falls back to sample menu entries so you can inspect the design; those sample IDs are not real MongoDB IDs and cannot be used for successful checkout.

## Deploying the frontend

For Vercel:

- Root directory: this frontend folder
- Framework preset: Create React App (or React Scripts)
- Build command: `npm run build`
- Output directory: `build`
- Environment variable: `REACT_APP_API_URL=https://YOUR-BACKEND-DOMAIN`
- `vercel.json` contains an SPA rewrite so `/cart` works after Stripe redirects back.

After changing the Vercel environment variable, rebuild/redeploy. The React app contains no Stripe secret key or webhook secret. Those remain in the backend environment only.

## Important scope note

PizzaNee is a fictional portfolio project, not a real restaurant. Keep Stripe in test mode; the site does not fulfil real food orders.
