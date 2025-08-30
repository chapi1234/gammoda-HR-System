export default function getPasswordResetMailOptions(email, name, otp) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Gammoda HR-System Password Reset OTP",
    html: `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Password Change OTP</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
                .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; }
                .header { text-align: center; }
                .title { font-size: 1.5rem; color: #d32f2f; margin: 16px 0 8px; }
                .otp { font-size: 2rem; color: #1a237e; letter-spacing: 2px; background: #e3f2fd; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 16px 0; }
                .content { color: #333; font-size: 1rem; margin-bottom: 24px; text-align: center; }
                .footer { color: #888; font-size: 0.9rem; text-align: center; margin-top: 32px; }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <div class="title">Password Change OTP</div>
                </div>
                <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Your One-Time Password (OTP) for changing your password is:</p>
                <div class="otp">${otp}</div>
                <p>Please enter this code to proceed with changing your password. This OTP is valid for a limited time.</p>
                </div>
                <div class="footer">
                &copy; 2025 GammoDA HR System. All rights reserved.
                </div>
            </div>
        </body>
    </html>`,
  };
}