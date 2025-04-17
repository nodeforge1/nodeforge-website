const dotenv = require('dotenv');
dotenv.config(); // Loads .env

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// Connect to MongoDB
require('./config/database');

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

// Configure CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://newnode-sr37.onrender.com",
    "https://nodebridges.netlify.app",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

// Set up MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI + 'Node',
  collection: 'sessions',
});

store.on('error', (error) => console.error("❌ MongoDB Store Error:", error));

// Set up session middleware
app.use(session({
  store,
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: 'strict',
  }
}));

// Import route handlers
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const StripePaymentRouter = require('./routes/StripePaymentRoutes');
const NowPaymentsRouter = require('./routes/CryptoPaymentRoutes');
const webhookRoutes = require('./routes/webhook');

// Define other routes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", StripePaymentRouter);
app.use("/api", NowPaymentsRouter);
app.use("/admin", adminRoutes);

// Mount webhook route using raw body middleware
app.use("/api/stripe-webhook", express.raw({ type: "application/json" }), webhookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the API. Server is running successfully!");
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});