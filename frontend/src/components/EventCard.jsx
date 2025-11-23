import React from "react";

const EventCard = ({ event, onRegister, onDelete, isAdmin, openModal }) => {
  const cardColor = event.registeredUsers.length > 5 ? "bg-red-100" : "bg-green-100";

  return (
    <div className={`${cardColor} border p-4 rounded-lg shadow-md mb-4 hover:shadow-xl transition`}>
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p className="text-gray-700">{event.description}</p>
      <p className="text-gray-500">{event.date} | {event.time}</p>
      <p className="text-gray-500">Location: {event.location}</p>
      <p className="text-gray-600 mt-1">Registered: {event.registeredUsers.length}</p>

      <div className="mt-3 flex gap-2">
        {isAdmin ? (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => openModal(event.id)}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
