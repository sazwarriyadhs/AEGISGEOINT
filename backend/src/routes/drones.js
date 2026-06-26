const express = require('express');
const router = express.Router();

// Sample drone data
const drones = [
  {
    id: 'DRN-001',
    name: 'DRONE 01 - ALPHA',
    model: 'DJI M30T',
    status: 'active',
    battery: 85,
    signal: 92,
    altitude: 120,
    speed: 25,
    lat: -2.5,
    lng: 140.5,
    flightTime: '2h 15m',
    mission: 'Surveillance',
    threatLevel: 'LOW',
    confidence: 0.92,
    sector: 'NORTH_BORDER'
  },
  {
    id: 'DRN-002',
    name: 'DRONE 02 - BRAVO',
    model: 'DJI M300',
    status: 'warning',
    battery: 78,
    signal: 65,
    altitude: 150,
    speed: 30,
    lat: -3.0,
    lng: 139.8,
    flightTime: '3h 45m',
    mission: 'Mapping',
    threatLevel: 'MEDIUM',
    confidence: 0.85,
    sector: 'EAST_BORDER'
  },
  {
    id: 'DRN-003',
    name: 'DRONE 03 - CHARLIE',
    model: 'Autel EVO',
    status: 'active',
    battery: 92,
    signal: 88,
    altitude: 200,
    speed: 35,
    lat: -2.8,
    lng: 140.2,
    flightTime: '1h 30m',
    mission: 'Search & Rescue',
    threatLevel: 'LOW',
    confidence: 0.95,
    sector: 'SOUTH_REGION'
  },
  {
    id: 'DRN-004',
    name: 'DRONE 04 - DELTA',
    model: 'DJI M30T',
    status: 'critical',
    battery: 45,
    signal: 55,
    altitude: 80,
    speed: 15,
    lat: -3.2,
    lng: 138.5,
    flightTime: '4h 20m',
    mission: 'Patrol',
    threatLevel: 'HIGH',
    confidence: 0.78,
    sector: 'WEST_BORDER'
  },
  {
    id: 'DRN-005',
    name: 'DRONE 05 - ECHO',
    model: 'Skydio',
    status: 'active',
    battery: 65,
    signal: 97,
    altitude: 110,
    speed: 45,
    lat: -2.2,
    lng: 141.0,
    flightTime: '2h 50m',
    mission: 'Surveillance',
    threatLevel: 'LOW',
    confidence: 0.88,
    sector: 'NORTH_EAST'
  },
  {
    id: 'DRN-006',
    name: 'DRONE 06 - FOXTROT',
    model: 'Parrot',
    status: 'idle',
    battery: 100,
    signal: 99,
    altitude: 0,
    speed: 0,
    lat: -2.6,
    lng: 140.7,
    flightTime: '0h 0m',
    mission: 'Idle',
    threatLevel: 'LOW',
    confidence: 1.0,
    sector: 'MAIN_BASE'
  },
  {
    id: 'DRN-007',
    name: 'DRONE 07 - GOLF',
    model: 'DJI M300',
    status: 'active',
    battery: 73,
    signal: 82,
    altitude: 180,
    speed: 28,
    lat: -3.5,
    lng: 139.2,
    flightTime: '5h 10m',
    mission: 'Mapping',
    threatLevel: 'MEDIUM',
    confidence: 0.82,
    sector: 'WEST_REGION'
  },
  {
    id: 'DRN-008',
    name: 'DRONE 08 - HOTEL',
    model: 'Autel EVO',
    status: 'warning',
    battery: 58,
    signal: 72,
    altitude: 95,
    speed: 20,
    lat: -2.9,
    lng: 140.9,
    flightTime: '3h 0m',
    mission: 'Search & Rescue',
    threatLevel: 'MEDIUM',
    confidence: 0.80,
    sector: 'SOUTH_EAST'
  }
];

// GET all drones
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: drones,
    count: drones.length
  });
});

// GET drone by ID
router.get('/:id', (req, res) => {
  const drone = drones.find(d => d.id === req.params.id);
  if (!drone) {
    return res.status(404).json({
      success: false,
      message: 'Drone not found'
    });
  }
  res.json({
    success: true,
    data: drone
  });
});

module.exports = router;
