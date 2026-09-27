import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes: verifies the incoming JWT token
export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token is present in the request Authorization header (Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract token from header ("Bearer eyJhbGciOi..." -> "eyJhbGciOi...")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify token signature with our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find user by the decoded ID and attach user object to req (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // 5. Pass control to the next function/controller!
            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
        }
    }

    // If no token was provided at all
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};
