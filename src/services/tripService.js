const BASE_URL = "http://localhost:5001/api";

export const startTripAPI = async (start, destination) => {
  const res = await fetch(`${BASE_URL}/trip/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ start, destination }),
  });

  return res.json();
};

export const endTripAPI = async () => {
  const res = await fetch(`${BASE_URL}/trip/end`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
};

export const getActiveTripAPI = async () => {
  const res = await fetch(`${BASE_URL}/trip/active`, {
    credentials: "include",
  });

  return res.json();
};

export const triggerSOSAPI = async (location) => {
  const res = await fetch(`${BASE_URL}/sos/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      message: "Route deviation detected",
      location,
    }),
  });

  return res.json();
};