const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();


const dbUrl = process.env.ATLASDB_URL
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: 'secret123'
  },
  touchAfter : 24 * 3600 , 
})





app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);


const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/users", authRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);



store.on("error", function (err) {
  console.log(" Error in MONGO Session store:", err);
});






app.get('/', (req, res) => {
  res.send('API is running...');
});

// Product route example (we'll define schema later)
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'iPhone 14', price: 799 },
    { id: 2, name: 'Samsung Galaxy S22', price: 699 },
  ]);
});



mongoose.connect(dbUrl)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
  })
  .catch(err => console.log(err));
