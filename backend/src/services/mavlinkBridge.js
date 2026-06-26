const { spawn } = require('child_process');
const WebSocket = require('ws');

class MAVLinkBridge {
  constructor() {
    this.drones = new Map();
    this.wsClients = new Set();
    this.isRunning = false;
    
    console.log('🚁 MAVLink Bridge initialized');
    this.startMAVLink();
    this.startUDPServer();
  }

  startMAVLink() {
    const python = spawn('python3', ['-c', 
import asyncio
from mavsdk import System
import json
import socket
import time

async def run():
    drone = System()
    await drone.connect(system_address="udp://:14550")
    
    print("✅ Connected to PX4")
    print("🚁 Streaming telemetry to AEGIS...")
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    async for position in drone.telemetry.position():
        telemetry = {
            "lat": position.latitude_deg,
            "lng": position.longitude_deg,
            "alt": position.relative_altitude_m,
            "timestamp": time.time()
        }
        sock.sendto(json.dumps(telemetry).encode(), ("localhost", 5002))
        print(f"📍 {telemetry}")

if __name__ == "__main__":
    asyncio.run(run())
    ]);

    python.stdout.on('data', (data) => {
      console.log(📡 MAVLink: );
    });

    python.stderr.on('data', (data) => {
      console.error(❌ MAVLink Error: );
    });

    python.on('close', (code) => {
      console.log(MAVLink process exited with code );
      setTimeout(() => this.startMAVLink(), 5000);
    });

    this.pythonProcess = python;
  }

  startUDPServer() {
    const dgram = require('dgram');
    this.udpServer = dgram.createSocket('udp4');
    
    this.udpServer.on('message', (msg, rinfo) => {
      try {
        const data = JSON.parse(msg.toString());
        this.broadcast({
          type: 'telemetry',
          drone: 'PX4-SITL',
          data: data
        });
      } catch (e) {
        console.error('UDP parse error:', e);
      }
    });
    
    this.udpServer.bind(5002, '0.0.0.0', () => {
      console.log('📡 UDP Server listening on port 5002');
    });
  }

  broadcast(message) {
    this.wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  addClient(ws) {
    this.wsClients.add(ws);
    console.log(📡 Client connected:  total);
  }
}

module.exports = new MAVLinkBridge();
