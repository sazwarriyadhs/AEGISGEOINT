// D:\AegisGeoInt\backend\src\services\dronePatrol.js
class DronePatrolService {
  constructor() {
    this.drones = [];
    this.wsClients = new Set();
    this.patrolRoutes = {};
    this.isRunning = false;
    
    // Initialize 4 patrol drones
    this.initPatrolDrones();
    this.startPatrol();
  }

  initPatrolDrones() {
    // Define patrol routes (waypoints)
    const routes = {
      'BORDER_PATROL': [
        { lat: -2.5, lng: 140.5 },
        { lat: -2.7, lng: 140.8 },
        { lat: -3.0, lng: 141.0 },
        { lat: -3.2, lng: 140.7 },
        { lat: -3.0, lng: 140.3 },
        { lat: -2.7, lng: 140.2 }
      ],
      'FOREST_PATROL': [
        { lat: -2.8, lng: 139.8 },
        { lat: -3.0, lng: 139.5 },
        { lat: -3.2, lng: 139.7 },
        { lat: -3.0, lng: 140.0 }
      ],
      'COASTAL_PATROL': [
        { lat: -2.5, lng: 141.0 },
        { lat: -2.3, lng: 141.2 },
        { lat: -2.0, lng: 141.5 },
        { lat: -2.2, lng: 141.8 }
      ],
      'SEARCH_RESCUE': [
        { lat: -2.6, lng: 140.0 },
        { lat: -2.8, lng: 140.3 },
        { lat: -2.5, lng: 140.5 },
        { lat: -2.3, lng: 140.2 }
      ]
    };

    const droneNames = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'];
    const missions = ['BORDER_PATROL', 'FOREST_PATROL', 'COASTAL_PATROL', 'SEARCH_RESCUE'];
    const statuses = ['active', 'active', 'warning', 'active'];

    this.drones = droneNames.map((name, i) => ({
      id: DRN-,
      name: DRONE  - ,
      model: ['DJI M30T', 'DJI M300', 'Autel EVO', 'DJI M30T'][i],
      status: statuses[i],
      battery: Math.floor(Math.random() * 30 + 70),
      signal: Math.floor(Math.random() * 20 + 80),
      altitude: Math.floor(Math.random() * 150 + 50),
      speed: Math.floor(Math.random() * 20 + 15),
      lat: routes[missions[i]][0].lat,
      lng: routes[missions[i]][0].lng,
      heading: 0,
      mission: missions[i],
      threatLevel: ['LOW', 'MEDIUM', 'HIGH', 'LOW'][i],
      confidence: 0.85 + Math.random() * 0.1,
      sector: ['NORTH', 'EAST', 'SOUTH', 'WEST'][i],
      currentWaypoint: 0,
      route: routes[missions[i]],
      patrolProgress: 0,
      flightTime: '0h 0m',
      totalFlights: Math.floor(Math.random() * 100 + 50)
    }));

    console.log('🚁 Drone Patrol initialized with ' + this.drones.length + ' drones');
  }

  startPatrol() {
    this.isRunning = true;
    console.log('🔄 Drone Patrol started...');

    // Update every 2 seconds
    this.interval = setInterval(() => {
      if (!this.isRunning) return;

      this.drones = this.drones.map(drone => {
        // Move along patrol route
        const route = drone.route;
        const currentIdx = drone.currentWaypoint;
        const nextIdx = (currentIdx + 1) % route.length;
        
        const current = route[currentIdx];
        const next = route[nextIdx];
        
        // Interpolate position
        const progress = drone.patrolProgress;
        const speed = 0.02; // Movement speed
        
        let newProgress = progress + speed;
        let newLat, newLng;
        
        if (newProgress >= 1) {
          newProgress = 0;
          drone.currentWaypoint = nextIdx;
          newLat = next.lat;
          newLng = next.lng;
        } else {
          newLat = current.lat + (next.lat - current.lat) * newProgress;
          newLng = current.lng + (next.lng - current.lng) * newProgress;
        }
        
        // Calculate heading
        const heading = Math.atan2(
          next.lng - current.lng,
          next.lat - current.lat
        ) * 180 / Math.PI;
        
        // Update battery (slow drain)
        const batteryDrop = 0.05;
        const newBattery = Math.max(5, drone.battery - batteryDrop);
        
        // Update status based on battery
        let newStatus = drone.status;
        if (newBattery < 15) newStatus = 'critical';
        else if (newBattery < 30) newStatus = 'warning';
        else if (newStatus === 'critical' || newStatus === 'warning') newStatus = 'active';
        
        // Update flight time
        const hours = Math.floor(drone.patrolProgress * 0.5);
        const minutes = Math.floor((drone.patrolProgress * 0.5 - hours) * 60);
        
        return {
          ...drone,
          lat: newLat,
          lng: newLng,
          heading: heading,
          battery: newBattery,
          status: newStatus,
          speed: 15 + Math.random() * 10,
          altitude: drone.altitude + (Math.random() - 0.5) * 5,
          signal: Math.max(60, drone.signal + (Math.random() - 0.5) * 2),
          patrolProgress: newProgress,
          flightTime: ${hours}h m,
          threatLevel: newBattery < 20 ? 'HIGH' : 
                       newBattery < 40 ? 'MEDIUM' : 'LOW'
        };
      });

      // Broadcast to all WebSocket clients
      this.broadcast({
        type: 'patrol_update',
        timestamp: new Date().toISOString(),
        drones: this.drones
      });

    }, 2000);
  }

  stopPatrol() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    console.log('🛑 Drone Patrol stopped');
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.wsClients.forEach(client => {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    });
  }

  addClient(ws) {
    this.wsClients.add(ws);
    console.log(📡 Client connected:  total);
    
    // Send initial data
    ws.send(JSON.stringify({
      type: 'patrol_init',
      drones: this.drones
    }));
  }

  removeClient(ws) {
    this.wsClients.delete(ws);
    console.log(📡 Client disconnected:  total);
  }

  getDrones() {
    return this.drones;
  }

  getDrone(id) {
    return this.drones.find(d => d.id === id);
  }

  // Manual control
  deployDrone(id, missionType) {
    const drone = this.getDrone(id);
    if (drone) {
      drone.status = 'active';
      drone.mission = missionType;
      return drone;
    }
    return null;
  }

  returnDrone(id) {
    const drone = this.getDrone(id);
    if (drone) {
      drone.status = 'returning';
      setTimeout(() => {
        drone.status = 'idle';
        drone.lat = -2.5;
        drone.lng = 140.5;
      }, 5000);
      return drone;
    }
    return null;
  }
}

module.exports = new DronePatrolService();
