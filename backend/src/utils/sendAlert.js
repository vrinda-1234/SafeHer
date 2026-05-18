import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";
import dotenv from "dotenv"
dotenv.config();
// ✅ create ONCE (not per request)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const sendAlert = async (user, lat, lng) => {
  try {
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

    await Promise.all(
      contacts.map(async (c) => {
        if (!c.email) return;

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
      })
    );
  } catch (err) {
    console.log("sendAlert error:", err.message);
  }
};

export default sendAlert;