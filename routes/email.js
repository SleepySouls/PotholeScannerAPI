const User = require("../models/User");
const emailTemplate = require("../models/emailTemplate");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Reset = require("../models/Reset");

//NodeMailer setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Reset password email
router.post("/resetpassword", async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetCode = Math.floor(Math.random() * 90000) + 10000;
        
        const reset = new Reset({
            email: email,
            resetCode: resetCode,
            resetCodeExpiry: new Date(Date.now() + 3600000),
        });
        await reset.save();

        const mailOptions = {
            from: 'PotholeScanner',
            to: email,
            subject: "Password Reset",
            html: emailTemplate(resetCode, true)
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error sending email"
                });
            }
            console.log("Email sent: " + info.response);
            res.status(200).json({
                success: true,
                message: "Reset code sent successfully"
            });
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
