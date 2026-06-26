// D:\AegisGeoInt\frontend\src\hooks\useDroneData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useDroneData = () => {
  const [drones, setDrones] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalDrones: 20,
    activeDrones: 12,
    totalMissions: 15,
    activeMissions: 8,
    events: 23,
    alerts: 7,
    criticalAlerts: 2,
    highAlerts: 5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDrones = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get('http://localhost:5000/api/drones', {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (res.data && res.data.data && res.data.data.length > 0) {
        const droneData = res.data.data.map((d, index) => ({
          id: d.drone_id || d.id || `DRN-${String(index + 1).padStart(3, '0')}`,
          name: d.name || d.callsign || `DRONE ${String(index + 1).padStart(2, '0')}`,
          status: (d.status || 'active').toLowerCase(),
          battery: d.battery || Math.floor(Math.random() * 40 + 60),
          signal: d.signal || Math.floor(Math.random() * 30 + 70),
          altitude: d.altitude || Math.floor(Math.random() * 200 + 50),
          speed: d.speed || Math.floor(Math.random() * 30 + 10),
          lat: d.lat || -2.5 + Math.random() * 2,
          lng: d.lon || 140.5 + Math.random() * 2,
          flightTime: d.flight_time || `${Math.floor(Math.random() * 4 + 1)}h ${Math.floor(Math.random() * 60)}m`,
          mission: d.mission || 'Surveillance',
          threatLevel: d.threat_level || 'LOW',
          confidence: d.confidence_score || 0.85,
          sector: d.sector || 'Unknown',
          image: `https://picsum.photos/seed/${d.drone_id || d.id || index}/200/150`,
          lastMaintenance: Math.floor(Math.random() * 30 + 1) + ' days ago',
          firmware: 'v' + (Math.floor(Math.random() * 2 + 3)) + '.' + (Math.floor(Math.random() * 5)) + '.' + (Math.floor(Math.random() * 10)),
          totalFlights: Math.floor(Math.random() * 500 + 100)
        }));

        setDrones(droneData);
        setStats(prev => ({
          ...prev,
          activeDrones: droneData.filter(d => d.status === 'active' || d.status === 'warning').length,
          totalDrones: droneData.length
        }));
      } else {
        const fallback = generateFallbackDrones();
        setDrones(fallback);
        setStats(prev => ({
          ...prev,
          activeDrones: fallback.filter(d => d.status === 'active' || d.status === 'warning').length,
          totalDrones: fallback.length
        }));
      }
    } catch (error) {
      console.error('Error fetching drones:', error);
      setError('Failed to load drone data');
      const fallback = generateFallbackDrones();
      setDrones(fallback);
      setStats(prev => ({
        ...prev,
        activeDrones: fallback.filter(d => d.status === 'active' || d.status === 'warning').length,
        totalDrones: fallback.length
      }));
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackDrones = () => {
    const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel'];
    const statuses = ['active', 'active', 'active', 'warning', 'active', 'idle', 'active', 'critical'];
    return names.map((name, i) => ({
      id: `DRN-${String(i + 1).padStart(3, '0')}`,
      name: `DRONE ${String(i + 1).padStart(2, '0')} - ${name}`,
      status: statuses[i] || 'active',
      battery: Math.floor(Math.random() * 40 + 60),
      signal: Math.floor(Math.random() * 30 + 70),
      altitude: Math.floor(Math.random() * 200 + 50),
      speed: Math.floor(Math.random() * 30 + 10),
      lat: -2.5 + Math.random() * 2,
      lng: 140.5 + Math.random() * 2,
      flightTime: `${Math.floor(Math.random() * 4 + 1)}h ${Math.floor(Math.random() * 60)}m`,
      mission: ['Surveillance', 'Mapping', 'Search & Rescue', 'Patrol', 'Idle'][Math.floor(Math.random() * 5)],
      threatLevel: ['LOW', 'MEDIUM', 'HIGH', 'LOW', 'LOW', 'LOW', 'MEDIUM', 'HIGH'][i],
      confidence: 0.7 + Math.random() * 0.25,
      sector: ['Sector Alpha', 'Sector Bravo', 'Sector Charlie'][Math.floor(Math.random() * 3)],
      image: `https://picsum.photos/seed/${i}/200/150`,
      lastMaintenance: Math.floor(Math.random() * 30 + 1) + ' days ago',
      firmware: `v${Math.floor(Math.random() * 2 + 3)}.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      totalFlights: Math.floor(Math.random() * 500 + 100)
    }));
  };

  useEffect(() => {
    fetchDrones();
    const interval = setInterval(fetchDrones, 10000);
    return () => clearInterval(interval);
  }, []);

  return { drones, events, stats, loading, error, refetch: fetchDrones };
};

export default useDroneData;