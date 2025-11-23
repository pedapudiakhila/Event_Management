import React, { useState } from "react";
import { addEvent } from "../api";
import EventList from "./EventList";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleAdd = async () => {
    if (!title || !description) return alert("Title and description required");
    await addEvent({ title, description, date, time, location, maxParticipants: 100 });
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-4 flex flex-col gap-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1 rounded mt-2"
        >
          Add Event
        </button>
      </div>

      <EventList isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
