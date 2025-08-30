export default function getPasswordChangeConfirmationMailOptions(email, name) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Gammoda HR-System Password Change Confirmation",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Change Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; }
    .header { text-align: center; }
    .title { font-size: 1.5rem; color: #1976d2; margin: 16px 0 8px; }
    .content { color: #333; font-size: 1rem; margin-bottom: 24px; text-align: center; }
    .footer { color: #888; font-size: 0.9rem; text-align: center; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Password Change Confirmation</div>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your password has been successfully changed. If you did not initiate this change, please contact support immediately.</p>
    </div>
    <div class="footer">
      &copy; 2025 GammoDA HR System. All rights reserved.
    </div>
  </div>
</body>
</html>`,
  };
}
