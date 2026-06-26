-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- ===== PAPUA SENSORS =====
CREATE TABLE IF NOT EXISTS papua_sensors (
    id SERIAL PRIMARY KEY,
    sensor_name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOMETRY(POINT, 4326),
    status VARCHAR(20) DEFAULT 'active',
    sector VARCHAR(50),
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== PAPUA TRACKED OBJECTS =====
CREATE TABLE IF NOT EXISTS papua_tracked_objects (
    id SERIAL PRIMARY KEY,
    object_id VARCHAR(50) UNIQUE,
    object_type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOMETRY(POINT, 4326),
    speed DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    confidence_score DECIMAL(5, 2),
    threat_level VARCHAR(20) DEFAULT 'Low',
    sector VARCHAR(50),
    border_distance DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== PAPUA THREAT EVENTS =====
CREATE TABLE IF NOT EXISTS papua_threat_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    threat_level VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_geom GEOMETRY(POINT, 4326),
    description TEXT,
    object_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== PAPUA RESTRICTED ZONES =====
CREATE TABLE IF NOT EXISTS papua_restricted_zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(50),
    polygon GEOMETRY(POLYGON, 4326),
    radius_km DECIMAL(10, 2),
    threat_level VARCHAR(20) DEFAULT 'High',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_papua_objects_location ON papua_tracked_objects USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_papua_objects_timestamp ON papua_tracked_objects (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_papua_threats_detected_at ON papua_threat_events (detected_at DESC);

-- ===== SAMPLE DATA =====
INSERT INTO papua_sensors (sensor_name, sensor_type, latitude, longitude, location, sector) VALUES
    ('Radar Jayapura-01', 'Radar', -2.5400, 140.7100, ST_SetSRID(ST_MakePoint(140.7100, -2.5400), 4326), 'Sector Alpha (Pelabuhan)'),
    ('CCTV Pelabuhan-01', 'CCTV', -2.5350, 140.7150, ST_SetSRID(ST_MakePoint(140.7150, -2.5350), 4326), 'Sector Alpha (Pelabuhan)'),
    ('Drone Patrol-01', 'Drone', -2.5200, 140.7300, ST_SetSRID(ST_MakePoint(140.7300, -2.5200), 4326), 'Sector Bravo (Bandara)'),
    ('Radar Perbatasan-01', 'Radar', -2.5500, 140.7000, ST_SetSRID(ST_MakePoint(140.7000, -2.5500), 4326), 'Sector Charlie (Perbatasan)'),
    ('Thermal-01', 'Thermal', -2.5100, 140.7500, ST_SetSRID(ST_MakePoint(140.7500, -2.5100), 4326), 'Sector Delta (Pos Militer)')
ON CONFLICT DO NOTHING;

INSERT INTO papua_restricted_zones (zone_name, zone_type, polygon, radius_km, threat_level) VALUES
    ('Border Zone 1', 'Restricted', ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(140.6900 -2.5450, 140.7100 -2.5450, 140.7100 -2.5650, 140.6900 -2.5650, 140.6900 -2.5450)')), 4326), 1.0, 'High'),
    ('Protected Area Alpha', 'Protected', ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(140.7050 -2.5350, 140.7250 -2.5350, 140.7250 -2.5550, 140.7050 -2.5550, 140.7050 -2.5350)')), 4326), 0.5, 'Medium')
ON CONFLICT DO NOTHING;

INSERT INTO papua_tracked_objects (object_id, object_type, latitude, longitude, location, speed, heading, confidence_score, threat_level, sector, border_distance) VALUES
    ('PAP-001', 'Boat', -2.5450, 140.7050, ST_SetSRID(ST_MakePoint(140.7050, -2.5450), 4326), 15.5, 180.0, 0.92, 'High', 'Sector Charlie (Perbatasan)', 0.5),
    ('PAP-002', 'Vehicle', -2.5250, 140.7250, ST_SetSRID(ST_MakePoint(140.7250, -2.5250), 4326), 45.0, 90.0, 0.88, 'Medium', 'Sector Bravo (Bandara)', 2.3),
    ('PAP-003', 'Person', -2.5350, 140.7100, ST_SetSRID(ST_MakePoint(140.7100, -2.5350), 4326), 3.2, 45.0, 0.85, 'Low', 'Sector Alpha (Pelabuhan)', 3.1)
ON CONFLICT DO NOTHING;
