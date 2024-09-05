import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['Authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    console.log(process.env.JWT_SECRET)
    if (token == null) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        console.log("Done")
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }

        next();
    } catch (err) {
        console.log(err)
        return res.status(403).json({ error: 'Something Went Wrong' ,err});
    }
};

export default authenticateToken;
