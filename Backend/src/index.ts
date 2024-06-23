import express, { Application } from 'express';
const cors = require('cors');
import bodyParser from 'body-parser';
import employeeRoutes from './routes'; // Updated import
import connectDB from './database';

const app: Application = express();
const port: number = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use(bodyParser.json());
app.use('/api', employeeRoutes); 

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
