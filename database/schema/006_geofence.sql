CREATE TABLE geofence (

    id SERIAL PRIMARY KEY,

    zone_name VARCHAR(100),

    zone_type VARCHAR(50),

    restriction_level VARCHAR(20),

    boundary GEOMETRY(POLYGON,4326),

    created_at TIMESTAMP DEFAULT NOW()

);
