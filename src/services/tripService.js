const BASE_URL = "http://localhost:5001/api";

export const startTripAPI = async (start, destination) => {
  const res = await fetch(`${BASE_URL}/trip/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      start,
      destination,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to start trip");
  }

  return res.json();
};

export const endTripAPI = async () => {
  const res = await fetch(`${BASE_URL}/trip/end`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to end trip");
  }

  return res.json();
};

export const getActiveTripAPI = async () => {
  const res = await fetch(`${BASE_URL}/trip/active`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch active trip");
  }

  return res.json();
};

export const triggerSOSAPI = async (location) => {
  const res = await fetch(`${BASE_URL}/sos/trigger`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      message: "Route deviation detected",
      location,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to trigger SOS");
  }

  return res.json();
};

export const updateSOSLocationAPI = async (
  sosId,
  location
) => {
  const res = await fetch(
    `${BASE_URL}/sos/update-location`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        sosId,
        lat: location.lat,
        lng: location.lng,
      }),
    }
  );

  return res.json();
};