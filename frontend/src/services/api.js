import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 10000,
});

// =======================
// INCIDENT SYSTEM (REAL)
// =======================

export const uploadIncident = (formData) =>
  API.post("/api/incident/upload", formData);

export const getHealth = () => API.get("/health");

export const getRoutes = () => API.get("/debug/routes");

// =======================
// GEOINT CORE (FROM BACKEND ROUTES)
// =======================

export const getDrones = () => API.get("/api/drones");
export const getTelemetry = () => API.get("/api/telemetry");
export const getDetections = () => API.get("/api/detections");
export const getAlerts = () => API.get("/api/alerts");
export const getMissions = () => API.get("/api/missions");
export const getThreats = () => API.get("/api/threats");

// =======================
// REALTIME STREAM (FUTURE)
// =======================

export const subscribeTelemetry = (cb) => {
  try {
    const ws = new WebSocket("ws://127.0.0.1:5000/ws");

    ws.onmessage = (msg) => {
      cb(JSON.parse(msg.data));
    };

    return ws;
  } catch (err) {
    console.log("WebSocket not ready yet:", err);
    return null;
  }
};

export default API;