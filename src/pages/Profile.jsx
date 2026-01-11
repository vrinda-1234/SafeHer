import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState([""]);

  const addContact = () => {
    setContacts([...contacts, ""]);
  };

  const updateContact = (index, value) => {
    const updated = [...contacts];
    updated[index] = value;
    setContacts(updated);
  };
  const saveProfile = () => {
    const profileData = {
      name,
      contacts,
    };

    localStorage.setItem("profile", JSON.stringify(profileData));
    alert("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          👤 Profile
        </h1>

        {/* Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Enter your name"
        />

        {/* Emergency Contacts */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Contacts
        </label>

        {contacts.map((contact, index) => (
          <input
            key={index}
            type="text"
            value={contact}
            onChange={(e) => updateContact(index, e.target.value)}
            className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder={`Contact ${index + 1}`}
          />
        ))}

        <button
          onClick={addContact}
          className="w-full mb-4 border border-purple-500 text-purple-700 py-2 rounded-lg hover:bg-purple-100 transition"
        >
          + Add Another Contact
        </button>

        <button
          onClick={saveProfile}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
