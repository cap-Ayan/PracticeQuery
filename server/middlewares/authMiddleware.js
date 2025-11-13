const {verifyToken} = require('../utils/authantication.js')

const userModel = require('../model/userModel.js');





const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    const token =
      req.cookies.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
        const {userId} = await verifyToken(token);

        const user = await userModel.findById(userId);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    
    }
}

module.exports = authenticateUser;