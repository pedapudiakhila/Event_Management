import React, { useState } from "react";

const RegistrationModal = ({ show, onClose, onRegister }) => {
  const [name, setName] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    if (!name) return alert("Enter your name");
    onRegister(name);
    setName("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Register for Event</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full px-2 py-1 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
