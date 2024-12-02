const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const user_jwt = require("../middleware/user_jwt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require('../models/blacklistToken');
const Reset = require("../models/Reset");

// @route GET api/user/auth
router.get("/auth", user_jwt, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({success: false, message: "Server got error :(("});
        next(error);
    }
})

// @route POST api/user/register
router.post("/register", async (req, res, next) => {
    const {username, email, phonenumber, password} = req.body;
    try {
        let user_exist = await User.findOne({email : email});
        if (user_exist) {
            return res.status(400).json({
                success: false, message: "User already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            email,
            phonenumber,
            password: hashedPassword
        });
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "360000"}, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: "User registered successfully",
                token: token
            });
        });
        
        
    } catch (error) {
        next(error);
    }
});

// @route POST api/user/login
router.post("/login", async (req, res, next) => {
    const {email, password} = req.body;
    try {
        let user_exist = await User.findOne({email : email});
        if (!user_exist) {
            return res.status(400).json({
                success: false, message: "User does not exist"
            });
        }
        const isMatch = await bcrypt.compare(password, user_exist.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false, message: "Incorrect Password"
            });
        }
        const payload = {
            user: {
                id: user_exist.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "360000"}, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: "Logged in successfully",
                token: token
            });
        });
    } catch (error) {
        next(error);
    }
});

// @route POST api/user/logout
router.post("/logout", user_jwt, async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.header('Authorization').replace('Bearer ', '');

        // Add the token to the blacklist
        await BlacklistedToken.create({ token });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        next(error);
    }
});

// @route POST api/user/changepassword
router.post("/changepassword", async (req, res, next) => {
    try {
        const {newPassword, reEnterNewPassword} = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(newPassword, reEnterNewPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false, message: "Incorrect Password"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        next(error);
    }
});

// @route POST api/user/editprofile
router.post("/editprofile", user_jwt, async (req, res, next) => {
    try {
        const {username, email, dob, phonenumber, address} = req.body;
        const user = await User.findById(req.user.id);
        user.username = username;   
        user.email = email;
        user.dob = dob;
        user.phonenumber = phonenumber;
        user.address = address;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile edited successfully"
        });
    } catch (error) {
        next(error);
    }
});

//route POST api/user/confirmcode
router.post("/confirmcode", async (req, res, next) => {
    const {resetCode} = req.body;
    try {
        const reset = await Reset.findOne({resetCode: resetCode});
        if (!reset) {
            return res.status(400).json({
                success: false, 
                message: "Invalid reset code"
            });
        }
        if (reset.resetCodeExpiry < Date.now()) {
            return res.status(400).json({
                success: false, 
                message: "Reset code has expired"
            });
        }
        res.status(200).json({
            success: true,
            message: "Reset code confirmed successfully",
            email: reset.email  // Return the email associated with the reset code
        });
    } catch (error) {
        next(error);
    }
});

// @route POST api/user/resetpassword
router.post("/resetpassword", async (req, res, next) => {
    const {email, newPassword, reEnterNewPassword} = req.body;
    try {
        if (newPassword !== reEnterNewPassword) {
            return res.status(400).json({
                success: false, 
                message: "Passwords do not match"
            });
        }

        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        // Optionally, delete the reset code after successful password change
        await Reset.deleteOne({email: email});
   
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;