import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const sendAlert = async (user, lat, lng) => {
  // 🔥 CREATE transporter HERE (INSIDE FUNCTION)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const contacts = await Contact.find({ userId: user._id });

  if (!contacts.length) {
    console.log("No contacts found");
    return;
  }

  const message = `
🚨 EMERGENCY ALERT 🚨

${user.name} needs help!

Location:
https://maps.google.com/?q=${lat},${lng}
`;

  for (let c of contacts) {
    if (!c.email) continue;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: c.email,
        subject: "🚨 Emergency Alert",
        text: message,
      });

      console.log(`Alert sent to ${c.email}`);
    } catch (err) {
      console.log("Email failed:", err.message);
    }
  }
};

export default sendAlert;