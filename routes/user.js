const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const user_jwt = require("../middleware/user_jwt");
const jwt = require("jsonwebtoken");



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


module.exports = router;