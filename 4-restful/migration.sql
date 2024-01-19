DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  age NUMERIC,
  name TEXT,
  kind TEXT
);

-- CREATE TABLE properties (
--     id SERIAL PRIMARY KEY,
--     name TEXT,
--     num_units INTEGER,
--     owner_id INTEGER REFERENCES owners NOT NULL
-- )