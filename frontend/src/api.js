const API_URL = "/api";

export const getEvents = async () => {
  const res = await fetch(`${API_URL}/events`);
  return res.json();
};

export const addEvent = async (event) => {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_URL}/events/${id}`, { method: "DELETE" });
  return res.json();
};

export const registerEvent = async (id, userName) => {
  const res = await fetch(`${API_URL}/events/register/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName }),
  });
  return res.json();
};
