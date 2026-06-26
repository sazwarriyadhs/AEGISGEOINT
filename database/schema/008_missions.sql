CREATE TABLE missions (

    id SERIAL PRIMARY KEY,

    mission_name VARCHAR(100),

    mission_type VARCHAR(50),

    status VARCHAR(30),

    created_at TIMESTAMP DEFAULT NOW()

);
