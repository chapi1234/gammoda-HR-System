export default function getAddEmployeeMailOptions(
  email,
  name,
  position,
  department,
  salary,
  password
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to GammoDA HR System - Your Account Details",
    html: `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>Welcome to GammoDA HR System</title>
				<style>
					body { font-family: Arial, sans-serif; background: #f6f8fa; margin: 0; padding: 0; }
					.container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; }
					.header { text-align: center; }
					.title { font-size: 1.5rem; color: #1976d2; margin: 16px 0 8px; }
					.details { background: #e3f2fd; border-radius: 6px; padding: 16px; margin: 16px 0; }
					.details p { margin: 8px 0; font-size: 1rem; color: #333; }
					.footer { color: #888; font-size: 0.9rem; text-align: center; margin-top: 32px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<div class="title">Welcome to GammoDA HR System!</div>
					</div>
					<div class="content">
						<p>Hi <strong>${name}</strong>,</p>
						<p>You have been added to the GammoDA HR System as a new employee. Below are your account details:</p>
						<div class="details">
							<p><strong>Email:</strong> ${email}</p>
							<p><strong>Position:</strong> ${position}</p>
							<p><strong>Department:</strong> ${department}</p>
							<p><strong>Salary:</strong> $${salary}</p>
							<p><strong>Temporary Password:</strong> <span style="color:#d32f2f;">${password}</span></p>
						</div>
						<p>Please use these credentials to log in for the first time. You can change your password after logging in.</p>
						<p>If you have any questions, feel free to contact HR.</p>
					</div>
					<div class="footer">
						&copy; 2025 GammoDA HR System. All rights reserved.
					</div>
				</div>
			</body>
			</html>`,
  };
}
