const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const token = req.header("Authorization");
    
    if (!token) 
        return res.status(401).json({success: false, message: "Access Denied"});

    try {
        await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({success: false, message: "Invalid Token"});
            }
            else{
                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server got error :(("});
    }
}