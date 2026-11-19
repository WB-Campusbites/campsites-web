# CampusBites — Backend REST API & MongoDB Atlas Integration

> **CampusBites: One Group. One Cart. Everyone Orders.**
> Full-stack campus food ordering platform supporting personal orders, group carts, and automatic bill splitting.

---

## 1. Project Overview

CampusBites allows students to order food individually or collaborate as a group under demo group code `CB-7X2W`, automatically splitting the ₹45 delivery fee equally among all ordering members.

This backend project implements an industry-standard **RESTful API** built with **Node.js, Express.js, and MongoDB Atlas with Mongoose**.

---

## 2. Features Preserved & Enhanced

- **Campus Outlets**: Burger Singh, Kathi Junction, Maggi Point, Greenox.
- **Dynamic Menu Loading**: Menus loaded dynamically from MongoDB Atlas with category filtering.
- **Ordering Modes**:
  - **Personal Cart**: Individual ordering with ₹0 delivery charge.
  - **Group Cart**: Multiple group members, shared cart, ₹45 delivery charge split equally among members.
- **Server-Side Price Validation**: Catalog prices and subtotal/total calculations are verified on the server.
- **Manual Custom Food Entries**: Allows manual custom items for campus demo orders with server validation.
- **User Authentication**: Secure signup and login with bcrypt password hashing and JWT token authentication.
- **Customer Feedback**: Persistent inquiries saved in MongoDB Atlas.
- **Role-Based Access Control**: Separate customer access and administrator privileges.

---

## 3. Technology Stack

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: REST API routing and middleware
- **MongoDB Atlas**: Cloud database cluster (`campusbites` database)
- **Mongoose**: ODM library for schemas, relationships, and validation
- **bcryptjs**: One-way cryptographic password hashing
- **jsonwebtoken (JWT)**: Stateless token-based user authentication
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **Postman**: API testing and demonstration

---

## 4. Backend Directory Structure

```
campusbites-backend/
├── config/
│   └── db.js                              # Mongoose connection to MongoDB Atlas
├── controllers/
│   ├── authController.js                  # Signup, Login, and Get Current User
│   ├── outletController.js                # Outlets CRUD logic
│   ├── foodController.js                  # Food items CRUD logic
│   ├── orderController.js                 # Orders CRUD & price validation
│   └── contactController.js               # Inquiries & feedback CRUD logic
├── middleware/
│   ├── authMiddleware.js                  # JWT verification & admin role check
│   └── errorMiddleware.js                 # Central 404 & error handlers
├── models/
│   ├── User.js                            # Customer & Admin user schema
│   ├── Outlet.js                          # Campus outlet schema
│   ├── Food.js                            # Food menu schema (references Outlet)
│   ├── Order.js                           # Personal & Group order schema
│   └── Contact.js                         # Feedback & inquiry schema
├── postman/
│   └── CampusBites.postman_collection.json # Complete evaluation Postman collection
├── routes/
│   ├── authRoutes.js                      # /api/signup, /api/login, /api/auth/me
│   ├── outletRoutes.js                    # /api/outlets
│   ├── foodRoutes.js                      # /api/foods
│   ├── orderRoutes.js                     # /api/orders
│   └── contactRoutes.js                   # /api/contact, /api/contacts
├── scripts/
│   └── seed.js                            # Database seed script for outlets & foods
├── tests/
│   └── api.test.js                        # Automated unit & calculation test suite
├── .env.example                           # Sample environment configuration
├── .gitignore                             # Git ignore rules (node_modules, .env, logs)
├── package.json                           # NPM dependencies and scripts
├── server.js                              # Main server entry point
├── EVALUATION_GUIDE.md                    # Viva preparation guide, Q&A, and demo script
└── README.md                              # Project documentation
```

---

## 5. MongoDB Atlas Cloud Setup Guide

1. **Create an Atlas Account**: Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) and register.
2. **Create a Free Cluster**: Choose **M0 Free Tier** (Shared), select AWS region (e.g., Mumbai `ap-south-1`).
3. **Create Database User**: In **Database Access**, add a user with password authentication and `readWriteAnyDatabase` privileges.
4. **Configure Network Access**: In **Network Access**, add IP `0.0.0.0/0` (allow from anywhere) for development.
5. **Get Connection String**: Go to Clusters -> Connect -> Drivers -> Node.js.
6. **Set Database Name**: Add `/campusbites` before the `?` query parameter:
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/campusbites?retryWrites=true&w=majority`
7. **Configure `.env`**: Set `MONGO_URI` in `.env`.

---

## 6. Installation & Running

### Step 1: Install Dependencies
```bash
cd campusbites-backend
npm install
```

### Step 2: Seed Initial Outlets & Menus into MongoDB Atlas
```bash
npm run seed
```

### Step 3: Run Automated Test Suite
```bash
npm test
```

### Step 4: Start the Backend Server
```bash
npm run dev
# Running on http://localhost:5000
```

### Step 5: Start Frontend
From the `campsites-web` directory:
```bash
npm start
# Running on http://localhost:3000
```

---

## 7. REST API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | API and database health status |
| `POST` | `/api/signup` | Public | Register new customer account |
| `POST` | `/api/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | Private | Current user profile |
| `GET` | `/api/outlets` | Public | List all campus food outlets |
| `GET` | `/api/outlets/:id` | Public | Get single outlet |
| `POST` | `/api/outlets` | Admin | Create outlet |
| `PUT` | `/api/outlets/:id` | Admin | Update outlet |
| `DELETE` | `/api/outlets/:id` | Admin | Delete outlet |
| `GET` | `/api/foods` | Public | List food items (`?outlet=` and `?category=`) |
| `GET` | `/api/foods/:id` | Public | Get single food item |
| `POST` | `/api/foods` | Admin | Create food item |
| `PUT` | `/api/foods/:id` | Admin | Update food item |
| `DELETE` | `/api/foods/:id` | Admin | Delete food item |
| `POST` | `/api/orders` | Public/Auth | Place order (Personal or Group) |
| `GET` | `/api/orders` | Private | Customer views their orders; Admin views all |
| `GET` | `/api/orders/:id` | Public/Auth | View single order by orderId or MongoDB ObjectId |
| `PUT` | `/api/orders/:id` | Private | Update order status |
| `DELETE` | `/api/orders/:id` | Admin | Delete order |
| `POST` | `/api/contact` | Public | Submit contact feedback |
| `GET` | `/api/contacts` | Admin | List feedback messages |
| `GET` | `/api/contacts/:id` | Admin | Read single feedback message |
| `PUT` | `/api/contacts/:id` | Admin | Update feedback status |
| `DELETE` | `/api/contacts/:id` | Admin | Delete feedback message |

---

## 8. Postman Testing

Import `postman/CampusBites.postman_collection.json` into Postman. It includes pre-written assertions, variables (`baseUrl`, `authToken`, `outletId`, `foodId`, `orderId`, `contactId`), and organized folders for all assignment CRUD requirements.
