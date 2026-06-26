// D:\AegisGeoInt\frontend\src\data\realEvents.js
export const realEvents = [
  {
    id: 1,
    title: "Illegal Logging Operation",
    location: "Yahukimo, Papua",
    image: "/images/real-events/deforestation.jpg",
    thumbnail: "/images/real-events/deforestation.jpg",
    description: "Deforestation detected in protected forest area. Multiple logging trucks identified.",
    severity: "HIGH",
    status: "ACTIVE",
    date: "2024-01-15",
    time: "10:23:45",
    lat: -4.8,
    lng: 139.5,
    object_id: "OBJ-001",
    confidence: 0.92
  },
  {
    id: 2,
    title: "Flood Disaster",
    location: "Jayapura, Papua",
    image: "/images/real-events/flood.jpg",
    thumbnail: "/images/real-events/flood.jpg",
    description: "Severe flooding in residential areas. Emergency response required.",
    severity: "CRITICAL",
    status: "ACTIVE",
    date: "2024-02-20",
    time: "14:10:22",
    lat: -2.5,
    lng: 140.7,
    object_id: "OBJ-002",
    confidence: 0.95
  },
  {
    id: 3,
    title: "Forest Fire Detection",
    location: "Pegunungan Bintang, Papua",
    image: "/images/real-events/forest-fire.jpg",
    thumbnail: "/images/real-events/forest-fire.jpg",
    description: "Active forest fire detected via thermal imaging. Spread rate: medium.",
    severity: "HIGH",
    status: "ACTIVE",
    date: "2024-03-05",
    time: "08:45:33",
    lat: -4.5,
    lng: 140.5,
    object_id: "OBJ-003",
    confidence: 0.88
  },
  {
    id: 4,
    title: "Illegal Mining Activity",
    location: "Nduga, Papua",
    image: "/images/incidents/illegal-mining.jpg",
    thumbnail: "/images/incidents/illegal-mining.jpg",
    description: "Suspected illegal mining operation. Excavation and processing equipment detected.",
    severity: "MEDIUM",
    status: "INVESTIGATING",
    date: "2024-03-12",
    time: "16:30:11",
    lat: -4.5,
    lng: 138.5,
    object_id: "OBJ-004",
    confidence: 0.78
  },
  {
    id: 5,
    title: "Wildlife Protection",
    location: "Asmat, Papua",
    image: "/images/incidents/wildlife.jpg",
    thumbnail: "/images/incidents/wildlife.jpg",
    description: "Protected species detected in conservation area. Monitoring active.",
    severity: "LOW",
    status: "RESOLVED",
    date: "2024-03-18",
    time: "09:20:44",
    lat: -5.5,
    lng: 138.5,
    object_id: "OBJ-005",
    confidence: 0.85
  }
];

export const droneFeedImages = [
  "/images/drone-feed/border-patrol.jpg",
  "/images/drone-feed/forest-surveillance.jpg",
  "/images/drone-feed/coastal-monitoring.jpg"
];

export const satelliteImages = [
  {
    name: "Papua 2023",
    url: "/images/satellite/papua-satellite-2023.jpg",
    year: 2023,
    cloudCover: 5
  },
  {
    name: "Papua Terrain",
    url: "/images/satellite/papua-terrain.jpg",
    year: 2024,
    cloudCover: 2
  },
  {
    name: "Papua Coast",
    url: "/images/satellite/papua-coast.jpg",
    year: 2024,
    cloudCover: 8
  }
];