import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    relation: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 FETCH CONTACTS
  const fetchContacts = async () => {
    try {
      const res = await API.get("/api/contact");
      setContacts(res.data);
    } catch {
      setErrorMsg("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 ADD CONTACT
  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await API.post("/api/contact", form);

      setForm({ name: "", phone: "", relation: "" });
      fetchContacts(); // refresh list
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add contact");
    }
  };

  // 🔥 DELETE CONTACT
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/contact/${id}`);
      fetchContacts();
    } catch {
      setErrorMsg("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Emergency Contacts</h1>

      {/* 🔥 ERROR */}
      {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}

      {/* 🔥 ADD FORM */}
      <form onSubmit={handleAdd} className="space-y-3 mb-6">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="relation"
          placeholder="Relation"
          value={form.relation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-purple-600 text-white py-2 rounded">
          Add Contact
        </button>
      </form>

      {/* 🔥 CONTACT LIST */}
      <ul className="space-y-3">
        {contacts.map((c) => (
          <li
            key={c._id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-600">{c.phone}</p>
              <p className="text-xs text-gray-400">{c.relation}</p>
            </div>

            <button
              onClick={() => handleDelete(c._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;