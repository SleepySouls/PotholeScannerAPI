const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistToken');

module.exports = async function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        
        const blacklistedToken = await BlacklistedToken.findOne({ token: token.replace('Bearer ', '') });
        if (blacklistedToken) {
            return res.status(401).json({
                msg: 'Token is no longer valid'
            });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid'
        });
    }
};