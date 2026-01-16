# 💰 SpendWise — Modern Expense Tracking Platform

> A production-ready, full-stack financial management application built with the MERN stack, featuring real-time analytics, AI-powered insights, and a beautiful, intuitive user interface.

![SpendWise Banner](https://img.shields.io/badge/MERN-Stack-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-2.0-orange)

---

## 🎯 Project Overview

SpendWise transforms personal finance management into an intuitive, visually engaging experience. Built with modern web technologies and design principles, it helps users gain actionable insights into their spending patterns through real-time analytics, automated categorization, and intelligent recommendations.

### **Why SpendWise?**

Most expense trackers are cluttered and difficult to use. SpendWise bridges this gap by offering:
- **Beautiful, modern UI** with gradient designs and smooth animations
- **Real-time insights** powered by intelligent data processing
- **Smart analytics** that identify spending patterns automatically
- **Subscription detection** to help users save money
- **Budget management** with visual progress tracking

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- JWT-based authentication with secure token management
- Password encryption using bcrypt (salt rounds: 10)
- Google OAuth 2.0 integration for seamless sign-in
- Protected routes with middleware authorization
- Secure user data isolation at database level
- Password validation (capital letters + special characters)

### 💳 **Expense Management**
- **Smart Expense Tracking**: Add, edit, delete transactions with ease
- **Category Classification**: 16+ predefined categories (Food, Rent, Travel, etc.)
- **Date-based Organization**: Track expenses over time
- **Search & Filter**: Find transactions instantly
- **Bulk Operations**: Manage multiple expenses efficiently
- **Real-time Updates**: See changes immediately across all views

### 📊 **Analytics Dashboard**
- **Total Spending Overview**: Real-time aggregation of all expenses
- **Category Breakdown**: Visual pie charts and bar graphs
- **Monthly Trends**: Line charts showing spending patterns
- **Budget Utilization**: Track spending against set limits
- **Top Spending Categories**: Identify where money goes most
- **Savings Calculator**: Income vs. expenses with savings rate

### 🎯 **Budget Management**
- **Category-specific Budgets**: Set limits for each spending category
- **Visual Progress Bars**: See budget utilization at a glance
- **Color-coded Alerts**: Green (safe), Yellow (warning), Red (exceeded)
- **Budget vs. Actual**: Compare planned vs. actual spending
- **Monthly Reset**: Automatic budget renewal each month

### 💡 **Smart Insights (AI-Powered)**
- **Daily Spending Patterns**: Average spending per day
- **Category Analysis**: Identify overspending areas
- **Trend Detection**: Week-over-week spending changes
- **Spending Intensity Alerts**: Warn about heavy spending days
- **Personalized Recommendations**: Actionable tips to save money
- **Positive Reinforcement**: Celebrate good financial behavior

### 🔁 **Subscription Detection**
- **Automatic Recognition**: Detects recurring expenses (2+ occurrences)
- **Monthly Cost Tracking**: See total subscription expenses
- **Yearly Projections**: Understand long-term financial impact
- **Average Cost Analysis**: Per-subscription spending insights
- **Cancellation Reminders**: Suggestions to review unused subscriptions

### ⚙️ **Settings & Customization**
- **Profile Management**: Update name, email, username
- **Password Change**: Secure password update with validation
- **Notification Preferences**: Email alerts, budget notifications, weekly reports
- **Appearance Settings**: Theme selection (Light/Dark/Auto)
- **Currency Selection**: Multiple currency support
- **Language Options**: Multi-language interface

---

## 🎨 Design System

### **Modern UI/UX Principles**
- **Gradient Backgrounds**: Beautiful color transitions throughout
- **Glassmorphism Effects**: Frosted glass cards and overlays
- **Micro-animations**: Smooth transitions and hover effects
- **Icon Integration**: Lucide React icons for visual clarity
- **Color Coding**: Intuitive status indicators
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode Ready**: Prepared for theme switching

### **Page-Specific Themes**
- **Dashboard**: Violet/Indigo gradient (analytics focus)
- **Expenses**: Rose/Orange gradient (spending awareness)
- **Budget**: Blue/Indigo gradient (planning & control)
- **Insights**: Indigo/Purple gradient (intelligence & analysis)
- **Subscriptions**: Cyan/Blue gradient (recurring payments)
- **Settings**: Slate/Gray gradient (system configuration)

---

## 🏗️ Technical Architecture

### **Frontend Stack**
```
React 18.x
├── React Router DOM (v6) - Client-side routing
├── Axios - API communication
├── Recharts - Data visualization
├── Lucide React - Icon library
├── Tailwind CSS - Utility-first styling
└── Component Architecture
    ├── Pages (7 main routes)
    ├── Layouts (AppLayout with sidebar)
    ├── Components (20+ reusable)
    └── Services (API abstraction)
```

### **Backend Stack**
```
Node.js + Express.js
├── MongoDB + Mongoose - Database & ODM
├── JWT - Token-based authentication
├── Bcrypt - Password hashing
├── Google OAuth - Social login
├── CORS - Cross-origin handling
└── RESTful API Design
    ├── Controllers (business logic)
    ├── Routes (endpoint definitions)
    ├── Models (schema definitions)
    ├── Middlewares (auth, validation)
    └── Services (data processing)
```

### **Database Schema**
```javascript
// User Model
{
  fullname: String,
  username: String (unique, indexed),
  password: String (hashed),
  email: String,
  createdAt: Date
}

// Expense Model
{
  userId: ObjectId (indexed),
  type: String,
  amount: Number,
  category: String (indexed),
  note: String,
  date: Date (indexed),
  createdAt: Date
}

// Budget Model
{
  userId: ObjectId (indexed),
  category: String (indexed),
  limit: Number,
  spent: Number,
  percentage: Number,
  status: String (enum: safe/warning/exceeded)
}
```

---

## 📁 Project Structure

```
SpendWise/
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth/         # Login & Register
│   │   │   ├── Dashboard/    # Main analytics view
│   │   │   ├── Expenses/     # Transaction management
│   │   │   ├── Budget/       # Budget tracking
│   │   │   ├── Insights/     # AI-powered insights
│   │   │   ├── Subscriptions/# Recurring expense detection
│   │   │   └── Settings/     # User preferences
│   │   │
│   │   ├── Components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseCategoryChart.jsx
│   │   │   ├── SmartInsights.jsx
│   │   │   └── GoogleLoginButton.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx  # Sidebar navigation
│   │   │
│   │   └── App.jsx            # Route configuration
│   │
│   └── tailwind.config.js
│
├── server/                    # Node.js Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── budgetController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Budget.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── budgetRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   │
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spendwise.git
cd spendwise
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
touch .env

# Add these variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Update API base URL if needed
# In src/config.js or component files
```

4. **Run the Application**

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

5. **Access the Application**
```
Open browser: http://localhost:5173
```

---

## 🔌 API Documentation

### **Authentication**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create new account | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/google` | Google OAuth login | No |

### **Expenses**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/expenses` | Get all user expenses | Yes |
| POST | `/expenses` | Create new expense | Yes |
| PUT | `/expenses/:id` | Update expense | Yes |
| DELETE | `/expenses/:id` | Delete expense | Yes |

### **Budgets**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/budgets` | Get all budgets | Yes |
| POST | `/budgets` | Create budget | Yes |
| DELETE | `/budgets/:category` | Delete budget | Yes |

### **Insights**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/insights` | Get AI insights | Yes |

---

## 🎯 Engineering Highlights

### **Performance Optimizations**
- **Memoized Calculations**: `useMemo` for expensive computations
- **Callback Optimization**: `useCallback` to prevent re-renders
- **Lazy Loading**: Code splitting for faster initial load
- **Debounced Search**: Reduced API calls on search input
- **Indexed Queries**: MongoDB indexes on userId, category, date
- **Aggregation Pipelines**: Server-side data processing

### **Security Best Practices**
- **JWT Expiration**: Tokens expire after 7 days
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Mongoose query sanitization
- **XSS Protection**: React's built-in XSS prevention
- **CORS Configuration**: Restricted origins in production

### **Code Quality**
- **Component Reusability**: 20+ reusable components
- **Custom Hooks**: Separated business logic from UI
- **Error Boundaries**: Graceful error handling
- **PropTypes Validation**: Type checking for components
- **Consistent Naming**: camelCase for functions, PascalCase for components
- **Comments & Documentation**: Clear inline documentation

### **Scalability Considerations**
- **Modular Architecture**: Easy to add new features
- **API Versioning Ready**: `/api/v1/` structure
- **Database Indexing**: Optimized for large datasets
- **Pagination Support**: Ready for implementing pagination
- **Caching Layer**: Prepared for Redis integration
- **Microservices Ready**: Loosely coupled services

---

## 📸 Screenshots

### Dashboard
*Beautiful analytics dashboard with real-time insights*

### Expenses
*Intuitive expense tracking with category charts*

### Budgets
*Visual budget management with progress tracking*

### Insights
*AI-powered spending analysis and recommendations*

---

## 🛣️ Roadmap

### **Phase 1: Core Features** ✅
- [x] User authentication (JWT + Google OAuth)
- [x] Expense CRUD operations
- [x] Budget management
- [x] Basic analytics dashboard
- [x] Category visualization

### **Phase 2: Advanced Analytics** ✅
- [x] Smart insights engine
- [x] Subscription detection
- [x] Month-over-month comparisons
- [x] Spending trend analysis
- [x] Top categories ranking

### **Phase 3: Enhanced UX** ✅
- [x] Modern gradient UI design
- [x] Smooth animations
- [x] Responsive layouts
- [x] Settings page
- [x] Empty states & loading indicators

### **Phase 4: Future Enhancements** 🚧
- [ ] Dark mode implementation
- [ ] Data export (CSV, PDF)
- [ ] Email notifications
- [ ] Budget forecasting with ML
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Collaborative budgets
- [ ] Receipt scanning (OCR)
- [ ] Bank account integration
- [ ] Investment tracking

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Atul Rathi**
- Email: rathiatul43@gmail.com
- LinkedIn: [linkedin.com/in/atulrathi18](https://www.linkedin.com/in/atulrathi18)
- GitHub: [@atulrathi](https://github.com/atulrathi)

---

## 🙏 Acknowledgments

- **Recharts** - Beautiful chart library
- **Lucide React** - Clean icon system
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB Atlas** - Cloud database hosting
- **Vercel/Netlify** - Deployment platforms

---

## 📧 Contact

For questions or feedback, reach out at: **rathiatul43@gmail.com**

---

<div align="center">
  
**⭐ Star this repository if you found it helpful!**

Made with ❤️ by Atul Rathi

</div>