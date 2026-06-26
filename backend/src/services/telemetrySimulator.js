const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8765
});

console.log('========================================');
console.log('🚁 AEGIS TELEMETRY SIMULATOR');
console.log('========================================');
console.log('📡 WebSocket running on port 8765');
console.log('🔄 Sending telemetry every 1 second');
console.log('========================================');

// Multi-drone telemetry
const drones = [
  { id: 'DRN-001', callsign: 'ALPHA', lat: -2.548926, lon: 140.718143, mission: 'BORDER_PATROL' },
  { id: 'DRN-002', callsign: 'BRAVO', lat: -2.812345, lon: 139.765432, mission: 'FOREST_PATROL' },
  { id: 'DRN-003', callsign: 'CHARLIE', lat: -2.456789, lon: 141.123456, mission: 'COASTAL_PATROL' },
  { id: 'DRN-004', callsign: 'DELTA', lat: -2.987654, lon: 140.876543, mission: 'SEARCH_RESCUE' },
  { id: 'DRN-005', callsign: 'ECHO', lat: -2.345678, lon: 139.987654, mission: 'SURVEILLANCE' },
  { id: 'DRN-006', callsign: 'FOXTROT', lat: -3.123456, lon: 141.234567, mission: 'RECON' },
  { id: 'DRN-007', callsign: 'GOLF', lat: -2.765432, lon: 140.345678, mission: 'ESCORT' },
  { id: 'DRN-008', callsign: 'HOTEL', lat: -3.234567, lon: 139.456789, mission: 'INTERDICTION' }
];

// Client tracking
let clients = new Set();

wss.on('connection', (ws) => {
  console.log('📡 Client connected');
  clients.add(ws);

  // Send initial data
  ws.send(JSON.stringify({
    type: 'init',
    drones: drones.map(d => ({
      drone_id: d.id,
      callsign: d.callsign,
      lat: d.lat,
      lon: d.lon,
      altitude: Math.floor(Math.random() * 150 + 50),
      speed: Math.floor(Math.random() * 25 + 10),
      heading: Math.floor(Math.random() * 360),
      battery: Math.floor(Math.random() * 30 + 70),
      signal: Math.floor(Math.random() * 20 + 80),
      mission: d.mission,
      status: 'ACTIVE',
      timestamp: new Date().toISOString()
    }))
  }));

  let interval = setInterval(() => {
    // Update drone positions
    const telemetry = drones.map((drone, index) => {
      // Random movement
      const latDelta = (Math.random() - 0.5) * 0.001;
      const lonDelta = (Math.random() - 0.5) * 0.001;
      
      drone.lat += latDelta;
      drone.lon += lonDelta;
      
      // Random battery drain
      const battery = Math.max(5, Math.floor(Math.random() * 30 + 70));
      const status = battery < 20 ? 'CRITICAL' : battery < 40 ? 'WARNING' : 'ACTIVE';
      
      return {
        drone_id: drone.id,
        callsign: drone.callsign,
        lat: drone.lat,
        lon: drone.lon,
        altitude: Math.floor(Math.random() * 150 + 50),
        speed: Math.floor(Math.random() * 25 + 10),
        heading: Math.floor(Math.random() * 360),
        battery: battery,
        signal: Math.floor(Math.random() * 20 + 80),
        mission: drone.mission,
        status: status,
        timestamp: new Date().toISOString()
      };
    });

    // Broadcast to all clients
    const message = JSON.stringify({
      type: 'telemetry',
      timestamp: new Date().toISOString(),
      drones: telemetry
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 1000);

  ws.on('close', () => {
    console.log('📡 Client disconnected');
    clients.delete(ws);
    clearInterval(interval);
  });
});

console.log('✅ Simulator ready! Waiting for connections...');
