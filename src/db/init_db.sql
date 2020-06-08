CREATE TABLE IF NOT EXISTS
      products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        category VARCHAR(128) NOT NULL,
        price DECIMAL NOT NULL
      );

CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        _date DATE NOT NULL,
        products INT[] NOT NULL,
        status VARCHAR(128) NOT NULL
      );

CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      );
INSERT INTO users(name, password)
      VALUES
      	('test_admin', 'test');
