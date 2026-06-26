CREATE TABLE detected_objects (

    id SERIAL PRIMARY KEY,

    object_type VARCHAR(50),

    confidence FLOAT,

    source_model VARCHAR(50),

    threat_score INT,

    location GEOGRAPHY(POINT,4326),

    detected_at TIMESTAMP DEFAULT NOW()

);
