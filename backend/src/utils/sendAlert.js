import Contact from "../models/Contact.js";

const sendAlert = async (user, lat, lng) => {
  console.log("🚨 SOS ALERT 🚨");
  console.log("User:", user.name);
  console.log("Location:", `https://maps.google.com/?q=${lat},${lng}`);

  console.log("Emergency Contacts:");

  const contacts = await Contact.find({ userId: user._id });

  if (!contacts || contacts.length === 0) {
    console.log("No emergency contacts found");
    return;
  }

  contacts.forEach((c) => {
    console.log(`${c.name}: ${c.phone}`);
  });
};

export default sendAlert;