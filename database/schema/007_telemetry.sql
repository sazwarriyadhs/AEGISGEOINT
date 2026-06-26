CREATE TABLE telemetry (

    id SERIAL PRIMARY KEY,

    drone_id VARCHAR(50),

    battery INT,

    altitude FLOAT,

    speed FLOAT,

    heading FLOAT,

    location GEOGRAPHY(POINT,4326),

    created_at TIMESTAMP DEFAULT NOW()

);
