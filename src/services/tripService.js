import API from "../utils/api";

export const startTripAPI = async (start, destination) => {
  const res = await API.post("/api/trip/start", {
    start,
    destination,
  });

  return res.data;
};

export const endTripAPI = async () => {
  const res = await API.post("/api/trip/end");
  return res.data;
};

export const getActiveTripAPI = async () => {
  const res = await API.get("/api/trip/active");
  return res.data;
};

export const triggerSOSAPI = async (location) => {
  const res = await API.post("/api/sos/trigger", {
    message: "Route deviation detected",
    location,
  });

  return res.data;
};

export const updateSOSLocationAPI = async (sosId, location) => {
  const res = await API.patch("/api/sos/update-location", {
    sosId,
    lat: location.lat,
    lng: location.lng,
  });

  return res.data;
};