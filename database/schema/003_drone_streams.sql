CREATE TABLE drone_streams (

    id SERIAL PRIMARY KEY,

    drone_id VARCHAR(50) NOT NULL,

    stream_url TEXT,

    protocol VARCHAR(30),

    status VARCHAR(20),

    created_at TIMESTAMP DEFAULT NOW()

);
