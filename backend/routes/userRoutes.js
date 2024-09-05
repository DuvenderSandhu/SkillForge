// routes/userRoutes.js

import express from  'express'
import User from  '../models/User.js'
import bcrypt from  'bcryptjs'
import jwt from  'jsonwebtoken'
import sendResponse from  '../utils/response.js'
import authenticateToken  from  '../utils/authenicateUser.js'

const UserRouter = express.Router();
// Register Route
UserRouter.get('/', async (req, res) => {

    try {
        let allUsers = await User.find();

        return sendResponse(res, 201, true, 'User registered successfully', { allUsers });
    } catch (error) {
        return sendResponse(res, 500, false, 'Server error', null, { error: error.message });
    }
});
UserRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return sendResponse(res, 400, false, 'User already exists');
        }

        user = new User({
            username,
            email,
            passwordHash: password,
        });

        await user.save();

        return sendResponse(res, 201, true, 'User registered successfully', { userId: user._id });
    } catch (error) {
        return sendResponse(res, 500, false, 'Server error', null, { error: error.message });
    }
});

// Login Route
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, false, 'Invalid email or password');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return sendResponse(res, 400, false, 'Invalid email or password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return sendResponse(res, 200, true, 'Login successful', { token:token,role:user.role });
    } catch (error) {
        return sendResponse(res, 500, false, 'Server error', null, { error: error.message });
    }
});

// get User
UserRouter.get('/user/me', authenticateToken, async (req, res) => {
    // console.log(req.user)
    try {
        let {user}=req
        if (!user) return res.status(404).json({ message: 'User not found' });
        console.log(user)
        sendResponse(res,200,true,"User Fetched",user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
});



export default UserRouter;
