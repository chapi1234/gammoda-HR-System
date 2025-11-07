export default function getContactMailOptions({ name, email, subject, message }) {
  return {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `[Contact Form] ${subject || "New message from website"}`,
    replyTo: email,
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>New Contact Message</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; margin:0; padding:0 }
          .container { max-width:600px; margin:24px auto; background:#fff; border-radius:8px; padding:20px; box-shadow:0 6px 18px rgba(0,0,0,0.06); }
          .header { text-align:center; color:#1976d2; font-size:20px; font-weight:700; }
          .section { margin-top:16px; }
          .label { font-weight:600; color:#333; }
          .value { margin-top:6px; color:#444; }
          .message { margin-top:12px; padding:12px; background:#f1f7ff; border-radius:6px; color:#222; }
          .footer { margin-top:20px; color:#888; font-size:13px; text-align:center }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">New Contact Message</div>
          <div class="section">
            <div class="label">From</div>
            <div class="value">${name || "(No name)"} &lt;${email || "(No email)"}&gt;</div>
          </div>
          <div class="section">
            <div class="label">Subject</div>
            <div class="value">${subject || "(No subject)"}</div>
          </div>
          <div class="section">
            <div class="label">Message</div>
            <div class="message">${(message || "").replace(/\n/g, "<br />")}</div>
          </div>
          <div class="footer">This message was sent from your website contact form.</div>
        </div>
      </body>
      </html>`,
  };
}
