CREATE TABLE threat_events(
    id SERIAL PRIMARY KEY,
    threat_level VARCHAR(20),
    detected_object VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
