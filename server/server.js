import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';


// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Initialize Express App
const app = express();

// 4. Middlewares
app.use(cors());
app.use(express.json());

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 6. Test Root Route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        system: 'AetherStack OS Core Gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 7. Start Listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`📡 Server is live and listening on http://localhost:${PORT}`);
});
