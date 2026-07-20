# Smart Farmer Hub

Smart Farmer Hub is a full-stack agricultural marketplace built to connect farmers, buyers, and administrators in a single digital workflow. The platform is designed to simplify crop listing, order management, payments, scheme discovery, chat support, and role-based business operations across the agricultural supply chain.

At a high level, the application brings together:

- Farmers who can manage crop inventory and product listings
- Buyers who can discover crops, place orders, and track transactions
- Admins who can manage users, crop data, and platform oversight
- An API layer that powers authentication, transactions, notifications, and business logic

## Why this project exists

Agriculture often requires coordination between producers, market participants, and support systems. Smart Farmer Hub aims to reduce friction in that process by creating a centralized place where crop supply can be surfaced, verified, and transacted more efficiently.

This project is not only a frontend demo; it is a practical full-stack system with a structured backend, database models, role-aware routes, and integration points for media, payments, and communication.

## Core features

### Farmer experience

- Create and manage crop listings
- Upload crop-related media and product details
- Track order interactions and inventory visibility
- Access role-based dashboard workflows

### Buyer experience

- Browse available crops through the marketplace UI
- Search, filter, and compare listings
- Place orders and review transaction status
- Use marketplace workflows designed for a smoother purchase journey

### Admin experience

- Manage platform users and business records
- Review operational data and administrative stats
- Maintain governance over crop-related content and user activity

### Platform capabilities

- JWT-based authentication
- REST API backend with modular route organization
- MongoDB persistence
- Cloudinary integration for media uploads
- Razorpay-ready payment flow
- Chat and communication support
- Internationalization support on the frontend

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Authentication: JWT
- Media storage: Cloudinary
- Payments: Razorpay
- Email / notifications: Nodemailer and third-party email provider support
- Frontend state and UI: React Router, React, Tailwind-inspired styling patterns, and component-driven architecture

## System architecture

The application follows a clean client-server split:

- Client application in [client/](client/)
- API and business logic in [server/src/](server/src/)
- Persistent data stored in MongoDB
- Media assets handled through Cloudinary

A simplified request flow looks like this:

Browser -> React frontend -> Express API -> MongoDB / Cloudinary / external service

## Project structure

```text
smart-farmer-hub/
├── client/                 # Vite + React frontend
├── server/                 # Express + MongoDB backend
├── README.md               # Project overview and onboarding guide
└── .gitignore              # Repository ignore rules
```

### Important entry points

- Frontend entry: [client/src/main.jsx](client/src/main.jsx)
- Backend app bootstrap: [server/src/app.js](server/src/app.js)
- Database connection: [server/src/DB/db.js](server/src/DB/db.js)
- API routes: [server/src/Routers/](server/src/Routers/)
- Frontend components: [client/src/component/](client/src/component/)

## Local development setup

### Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ recommended
- npm or pnpm
- A running MongoDB instance
- Access to Cloudinary and a payment provider configuration if you want to test those features fully

### 1) Install dependencies

```bash
# backend
cd server
npm install

# frontend
cd ../client
npm install
```

### 2) Configure environment variables

Create a `.env` file in the `server/` directory with the values required by the backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

> Keep secrets in environment variables and never commit `.env` files to version control.

### 3) Start the development servers

```bash
# backend
cd server
npm run dev

# frontend
cd ../client
npm run dev
```

### Default local URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Useful commands

### Backend

```bash
cd server
npm run dev
npm run start
```

### Frontend

```bash
cd client
npm run dev
npm run build
npm run lint
```

## Development guidelines

A few practices that help keep this codebase maintainable:

- Keep API routes and controller logic separated cleanly
- Reuse consistent error handling patterns across endpoints
- Prefer environment-based configuration over hardcoded secrets
- Use small, focused pull requests with clear descriptions
- Document new routes or workflow changes in the README when they affect the developer experience

## Roadmap / next improvements

This project can be strengthened further with:

- A proper `.env.example` file for onboarding
- A dedicated API reference for major endpoints
- Automated test coverage for backend and frontend flows
- CI/CD setup for linting and build validation
- Better production deployment documentation

## Contributing

Contributions are welcome as long as changes stay aligned with the application’s goal: improving the agricultural marketplace experience for real users.

When making changes:

1. Create a feature branch
2. Keep changes focused and readable
3. Verify the impacted flows locally
4. Update documentation if the behavior or setup changes

## Summary

Smart Farmer Hub is a practical, role-based marketplace application with a production-style architecture and an emphasis on agricultural workflows. If you are onboarding into the codebase, start from the client UI, the API routes, and the MongoDB models to understand how the business flow is wired end to end.

