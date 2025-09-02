export default function getRemoveEmployeeMailOptions(
  email,
  name,
  position,
  department
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "GammoDA HR-System Account Removal Notification",
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Account Removal Notification</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
          .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; }
          .header { text-align: center; }
          .title { font-size: 1.5rem; color: #d32f2f; margin: 16px 0 8px; }
          .logo { margin: 0 auto 16px; display: block; border-radius: 8px; width: 80px; height: 80px; object-fit: cover; }
          .content { color: #333; font-size: 1rem; margin-bottom: 24px; text-align: center; }
          .footer { color: #888; font-size: 0.9rem; text-align: center; margin-top: 32px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="http://localhost:5000/assets/download.jpg" alt="GammoDA Logo" class="logo" />
            <div class="title">Account Removal Notification</div>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your account as <strong>${position}</strong> in <strong>${department}</strong> has been removed from the GammoDA HR System.</p>
            <p>If you have any questions, please contact HR.</p>
          </div>
          <div class="footer">
            &copy; 2025 GammoDA HR System. All rights reserved.
          </div>
        </div>
      </body>
      </html>`,
  };
}
