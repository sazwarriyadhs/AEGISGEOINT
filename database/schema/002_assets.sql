CREATE TABLE assets(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    asset_type VARCHAR(100),
    geom GEOMETRY(Point,4326)
);
