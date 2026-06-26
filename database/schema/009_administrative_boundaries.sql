CREATE TABLE administrative_boundaries (

    id SERIAL PRIMARY KEY,

    region_name VARCHAR(100),

    province VARCHAR(100),

    district VARCHAR(100),

    boundary GEOMETRY(MULTIPOLYGON,4326)

);
