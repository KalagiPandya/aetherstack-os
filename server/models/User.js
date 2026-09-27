import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the Blueprint (Schema)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true, // No two users can have the same email
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Prevents password from being returned in API queries by default
        },
        role: {
            type: String,
            enum: ['developer', 'creator', 'admin'],
            default: 'developer',
        },
        bio: {
            type: String,
            default: 'Hello! I am a developer building on DevFlow.',
            maxlength: [200, 'Bio cannot exceed 200 characters'],
        },
        avatar: {
            type: String,
            default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
    },
    {
        timestamps: true, // Automatically creates and manages 'createdAt' and 'updatedAt' fields
    }
);

// 2. Pre-Save Hook: Automatically hash the password before saving to DB
userSchema.pre('save', async function () {
    // Only hash the password if it was actually modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    // Generate a salt (random security string) and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 3. Helper Method: Compare entered password with the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Create and Export the Model
const User = mongoose.model('User', userSchema);

export default User;
