# PizzaNee 🍕

**Your slice. Your rules.**

PizzaNee is a Bengaluru-inspired pizza-ordering concept built as a full-stack software portfolio project by **Nikhil Mugali**. It demonstrates a pizza menu, a custom pizza builder, cart management, and Stripe Checkout in test mode.

> **Portfolio/demo project:** PizzaNee is a fictional brand, not an operating restaurant. It does not accept or fulfil real food orders. Stripe checkout should remain in test mode for this project.

## Features

- Browse pizzas from the backend API.
- Add pizzas to the cart, adjust quantities, and remove items.
- Build a custom pizza by choosing a base, sauce, cheese, and vegetables.
- Validate custom ingredients and calculate prices on the backend rather than trusting prices sent by the browser.
- Create orders and store them in MongoDB.
- Use Stripe-hosted Checkout in test mode.
- Verify payment state through a Stripe webhook and update orders after confirmed payment.
- Display payment success, cancellation, and pending/verification messages in the frontend.

## Tech stack

**Frontend:** React (Create React App), React Router, Redux Toolkit, CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB with Mongoose  
**Payments:** Stripe Checkout and webhooks  
**Development:** Git, GitHub, Nodemon, Stripe CLI

## Project structure

```text
PizzaNee/
├── backend/
│   ├── models/
│   │   ├── Order.js
│   │   └── Pizza.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── pizzaRoutes.js
│   │   └── stripeWebhook.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── .env
```

## Requirements

- Node.js and npm
- MongoDB Atlas or another reachable MongoDB instance
- A Stripe account with test-mode API keys
- Stripe CLI for local webhook testing

## Run locally

### 1. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` with your own values:

```dotenv
PORT=5000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_local_listener_secret
FRONTEND_URL=http://localhost:3000
```

Do not commit this file or share its secrets. The `STRIPE_WEBHOOK_SECRET` value for local development comes from the Stripe CLI listener below. Use a test-mode Stripe secret key (`sk_test_...`), not a live key.

Start the backend:

```bash
node server.js
```

If Nodemon is installed in the backend project, you can instead run:

```bash
npx nodemon server.js
```

The API should be available at `http://localhost:5000`.

### 2. Configure and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

For local development, frontend API requests should point to `http://localhost:5000`. If you configure a frontend API environment variable, Create React App expects variables prefixed with `REACT_APP_`, for example:

```dotenv
REACT_APP_API_URL=http://localhost:5000
```

That variable is only used if the frontend code reads it. Before deployment, ensure API calls use the configured API base URL rather than hard-coded localhost URLs.

Start the React app:

```bash
npm start
```

The frontend should open at `http://localhost:3000`.

### 3. Set up the local Stripe webhook

With the backend running, open a third terminal and run:

```bash
stripe listen --events checkout.session.completed --forward-to http://localhost:5000/api/payments/webhook
```

The Stripe CLI will print a local webhook signing secret beginning with `whsec_`. Copy that value into `backend/.env` as `STRIPE_WEBHOOK_SECRET`, then restart the backend. Keep the Stripe CLI listener running while testing local payments.

Use Stripe test-mode payment details only. Do not enter real card details for this portfolio demo.

## Payment flow

1. The frontend sends cart items and quantities to the backend.
2. The backend validates standard pizza IDs and custom pizza ingredients, then calculates prices from trusted database/server-side values.
3. The backend creates a pending order and a Stripe Checkout Session.
4. Stripe redirects the customer back to the frontend after checkout.
5. Stripe sends a signed webhook event to the backend.
6. The backend verifies the webhook signature and updates the matching order when payment is confirmed.
7. The frontend checks the session/order status and displays the result.

A browser redirect alone is not proof of payment. The backend webhook is responsible for recording confirmed payment state.

## Useful API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | API health/message check |
| `POST` | `/api/payments/create-checkout-session` | Validate cart and create Stripe Checkout Session |
| `GET` | `/api/payments/verify-session/:sessionId` | Read checkout/order payment status |
| `POST` | `/api/payments/webhook` | Receive and verify Stripe webhook events |

The pizza and order routes are mounted under `/api/pizzas` and `/api/orders`; see the route files for the operations they expose.

## Deployment notes

A typical portfolio deployment can use Vercel for the React frontend, Render for the Express API, and MongoDB Atlas for the database.

Before deploying:

1. Push the project to GitHub only after confirming that `.env` files and secrets are excluded from Git.
2. Configure the backend's `MONGO_URI`, `STRIPE_SECRET_KEY`, and `FRONTEND_URL` in the hosting provider's environment settings.
3. Configure the frontend's production API URL and make sure no API request still targets `localhost:5000`.
4. Update CORS to allow your actual deployed frontend origin.
5. Create a Stripe Dashboard webhook endpoint pointing to `https://YOUR-BACKEND-DOMAIN/api/payments/webhook` and subscribe to the events handled by the backend, including `checkout.session.completed`.
6. Set `STRIPE_WEBHOOK_SECRET` on the backend to the signing secret generated for that Dashboard endpoint. It is different from the local Stripe CLI secret.
7. Redeploy, then test the full flow using Stripe test mode and confirm the order status in MongoDB.

Do not put Stripe secret keys or webhook secrets in frontend code or public repositories. Free hosting tiers can sleep or have other limitations; this is a portfolio demo, not a production-ready food delivery service.

## Safety and scope

- This project is not a real restaurant and does not fulfil food orders.
- Keep Stripe in test mode for portfolio demonstrations.
- Do not store secret values in source control.
- Before accepting real orders or payments, additional work is required for real fulfilment, operational support, security, privacy, applicable registrations/licences, and production payment configuration.

## Author

**Nikhil Mugali** — creator and full-stack developer.
