const WebSocket = require('ws');

class TelemetryService {
  constructor() {
    this.ws = null;
    this.clients = new Set();
    this.telemetry = {};
    this.isConnected = false;
    this.drones = [];
    this.connect();
  }

  connect() {
    try {
      console.log('Connecting to Telemetry Simulator...');
      
      // Connect ke simulator yang berjalan di host
      this.ws = new WebSocket('ws://host.docker.internal:8765');
      
      this.ws.on('open', () => {
        console.log('Connected to Telemetry Simulator');
        this.isConnected = true;
      });
      
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (e) {
          console.error('Error parsing telemetry:', e);
        }
      });
      
      this.ws.on('error', (error) => {
        console.error('Telemetry Simulator error:', error.message);
        this.isConnected = false;
      });
      
      this.ws.on('close', () => {
        console.log('Disconnected from Telemetry Simulator');
        this.isConnected = false;
        setTimeout(() => this.connect(), 5000);
      });
      
    } catch (e) {
      console.error('Connection error:', e.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  handleMessage(message) {
    if (message.type === 'telemetry' || message.type === 'init') {
      this.drones = message.drones || [];
      this.broadcast(message);
    }
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  addClient(ws) {
    this.clients.add(ws);
    console.log('Client connected: ' + this.clients.size + ' total');
    
    if (this.drones.length > 0) {
      ws.send(JSON.stringify({
        type: 'init',
        drones: this.drones
      }));
    }
  }

  removeClient(ws) {
    this.clients.delete(ws);
    console.log('Client disconnected: ' + this.clients.size + ' total');
  }

  getDrones() {
    return this.drones;
  }
}

module.exports = new TelemetryService();
