import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    relation: "",
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (editingId) {
        await API.put(`/api/contact/${editingId}`, form);

        setEditingId(null);
      } else {
        await API.post("/api/contact", form);
      }

      setForm({
        name: "",
        phone: "",
        relation: "",
        email: "",
      });

      fetchContacts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to save contact");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/contact/${id}`);
      fetchContacts();
    } catch {
      setErrorMsg("Delete failed");
    }
  };
  const handleEdit = (contact) => {
    setEditingId(contact._id);

    setForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      relation: contact.relation || "",
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        {/* Add Contact Form */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">
            Add New Contact
          </h2>

          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder=" Full Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              name="phone"
              placeholder=" Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              name="email"
              placeholder=" Email Address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            <input
              name="relation"
              placeholder=" Relation"
              value={form.relation}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
              >
                {editingId ? "Update Contact" : "+ Add Contact"}
              </button>
            </div>
          </form>
        </div>

        {/* Contact List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Saved Contacts
          </h2>

          {contacts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow">
              <p className="text-gray-500">No emergency contacts added yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center hover:shadow-xl transition duration-300"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {c.name}
                    </h3>

                    <p className="text-gray-600 mt-1">📞 {c.phone}</p>

                    <p className="text-gray-600">✉️ {c.email}</p>

                    {c.relation && (
                      <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {c.relation}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
