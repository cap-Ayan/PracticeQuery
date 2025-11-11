const express = require('express');
const dotenv = require('dotenv');
const app = express();
const connectDb = require('./config/connectDb.js');
dotenv.config();
const productRoutes = require('./route/productRoutes.js');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const http = require('http');


app.use(cors());
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
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});