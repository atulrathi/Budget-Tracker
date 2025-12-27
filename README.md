SpendWise — Scalable Expense Tracking Platform (MERN)

SpendWise is a production-oriented full-stack web application designed to help users gain real-time visibility into personal spending patterns.
The system emphasizes secure authentication, modular architecture, performance-aware data handling, and responsive UI design, reflecting real-world engineering practices used in large-scale applications.

Why This Project Matters

Most people track income but lack actionable insights into spending behavior.
SpendWise addresses this gap by transforming raw transaction data into structured, user-specific financial insights, while maintaining security, scalability, and clean code standards.

This project demonstrates my ability to:

Design end-to-end systems

Build secure APIs

Manage stateful frontends

Write maintainable, extensible code

Core Capabilities
Authentication & Security

JWT-based authentication with secure token handling

Password hashing using bcrypt

Google OAuth integration

Route protection and authorization middleware

Strict user data isolation at the database level

Expense & Data Management

CRUD operations for income and expenses

Category-based classification with aggregation logic

Date-driven records for analytical queries

Optimized MongoDB schema design

Analytics & Dashboard

Real-time calculation of total expenses

Category-wise aggregation using efficient data processing

Transaction count metrics

Visual indicators for spending distribution

Responsive layouts optimized for all screen sizes

Engineering Highlights (Recruiter-Focused)

Separation of Concerns
Clear division between controllers, routes, services, and UI components

Scalable Backend Design
RESTful APIs built with Express.js and MongoDB using Mongoose schemas

Performance-Aware Logic
Aggregation pipelines for analytics instead of repeated client-side computation

Secure by Default
Encrypted credentials, protected routes, and token validation middleware

Responsive UI Architecture
Mobile-first approach using Tailwind CSS with reusable components

Tech Stack
Frontend

React.js (component-driven architecture)

Tailwind CSS (utility-first, responsive styling)

React Router DOM

Axios for API communication

Backend

Node.js

Express.js

MongoDB with Mongoose

JWT Authentication

Google OAuth

Project Structure
SpendWise/
├── client/        # React frontend
│   ├── components
│   ├── pages
│   ├── layouts
│   └── services
│
├── server/        # Node.js backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middlewares
│   └── server.js
│
└── README.md

Setup & Execution
# Clone repository
git clone https://github.com/atulrathi/spendwise.git

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Run backend
npm run dev

# Run frontend
npm run dev

Sample API Endpoints
Method	Endpoint	Purpose
POST	/auth/login	User authentication
POST	/auth/google	OAuth login
POST	/expenses	Add expense
GET	/expenses	Fetch user expenses
Future Roadmap (Designed for Scale)

Budget forecasting and alerts

Monthly & yearly analytics

Subscription detection

Data export (CSV / PDF)

AI-driven spending insights

Dark mode & accessibility enhancements
