import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import RegistrationModal from "./RegistrationModal";
import { getEvents, deleteEvent, registerEvent } from "../api";

const EventList = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };

  const openModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowModal(true);
  };

  const handleRegister = async (name) => {
    if (!selectedEvent) return;
    await registerEvent(selectedEvent, name);
    setShowModal(false);
    fetchEvents();
  };

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={handleDelete}
          isAdmin={isAdmin}
          openModal={openModal}
        />
      ))}

      <RegistrationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default EventList;
