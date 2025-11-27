const express = require('express');
const dotenv = require('dotenv');

const app = express();
const connectDb = require('./config/connectDb.js');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
dotenv.config();
const productRoutes = require('./route/productRoutes.js');
const reiewRoutes = require('./route/reviewRoutes.js');
const userRoutes = require('./route/userRoutes.js');
const cartRoutes = require('./route/cartRoutes.js');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const http = require('http');


app.use(cors({
    origin: "http://localhost:5173",  // your React app URL
    credentials: true,                // allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
connectDb();
const seedData = require('./seed.js');
//seedData();



// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/products', productRoutes);


app.use('/api/reviews', reiewRoutes);

app.use('/api/users', userRoutes);

app.use("/api/cart", cartRoutes);

const server = http.createServer(app);



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});