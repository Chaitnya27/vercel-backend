const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require("path");



const app = express();
// const _dirname = path.resolve();

// app.use(express.static(path.join(_dirname,"/frontend/dist")));
// app.get("*",(_,res)=>{
//   res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
// });
app.use(cors());
app.use(express.json());


const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/users", authRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);









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

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
  })
  .catch(err => console.log(err));
