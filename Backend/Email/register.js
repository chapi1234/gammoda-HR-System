// const getRegisterMailOptions = (email, name, otp) => {
//   return {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Gammoda HR-System Registration OTP",
//     html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>GammoDA HR-System OTP Verification</title>
//   <style>
//     body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
//     .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; }
//     .header { text-align: center; }
//     .title { font-size: 1.5rem; color: #1976d2; margin: 16px 0 8px; }
//     .otp { font-size: 2rem; color: #1a237e; letter-spacing: 2px; background: #e3f2fd; padding: 12px 24px; border-radius: 6px; display: inline-block; margin: 16px 0; }
//     .content { color: #333; font-size: 1rem; margin-bottom: 24px; text-align: center; }
//     .footer { color: #888; font-size: 0.9rem; text-align: center; margin-top: 32px; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <div class="title">OTP Verification</div>
//     </div>
//     <div class="content">
//       <p>Dear User,</p>
//       <p>Your One-Time Password (OTP) for registration is:</p>
//       <div class="otp">${otp}</div>
//       <p>Please enter this code to complete your registration. This OTP is valid for a limited time.</p>
//     </div>
//     <div class="footer">
//       &copy; 2025 GammoDA HR System. All rights reserved.
//     </div>
//   </div>
// </body>
// </html>`,
//   };
// };

export default function getRegisterMailOptions(email, name) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Gammoda HR-System Registration Successful",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Registration Successful</title>
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
      <div class="title">Registration Successful</div>
    </div>
    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your registration to GammoDA HR System was successful. You can now log in and access your dashboard.</p>
    </div>
    <div class="footer">
      &copy; 2025 GammoDA HR System. All rights reserved.
    </div>
  </div>
</body>
</html>`,
  };
}
