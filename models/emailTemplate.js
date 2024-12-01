module.exports = function emailTemplate(code, isPasswordReset = false) {
    const title = isPasswordReset ? "Reset Your Password" : "Verify Your Email";
    const message = isPasswordReset 
        ? "We received a request to reset your password. If you didn't make this request, please ignore this email."
        : "Please verify your email address to complete your registration.";
    const codeMessage = isPasswordReset
        ? "The password reset code is:"
        : "Your verification code is:";

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">${title}</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p>Hello,</p>
            <p>${message}</p>
            <p>${codeMessage} <b>${code}</b></p>
            <p>This code will expire in 1 hour for security reasons.</p>
            <p>Best regards,<br>Pothole Scanner</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </body>
    </html>`;
};