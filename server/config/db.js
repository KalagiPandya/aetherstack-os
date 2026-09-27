import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings across all environments
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
    // Fallback gracefully if setServers is restricted
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb Atlas Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB connection Erro: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;