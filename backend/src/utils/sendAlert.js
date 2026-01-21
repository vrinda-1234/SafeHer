const sendAlert = async (user, lat, lng) => {
  console.log("🚨 SOS ALERT 🚨");
  console.log("User:", user.name);
  console.log(
    "Location:",
    `https://maps.google.com/?q=${lat},${lng}`
  );
  console.log("Contacts:", user.contacts);
};

export default sendAlert;
