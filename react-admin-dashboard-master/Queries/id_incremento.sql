

-- Renombrar la tabla original
EXEC sp_rename 'Flights_US', 'Flights_US_Old';

-- Crear una nueva tabla con la columna ID auto-incremental
CREATE TABLE Flights_US (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    date DATE,
    city1 VARCHAR(50),
    city2 VARCHAR(50),
    airport1 VARCHAR(50),
    airport2 VARCHAR(50),
    nsmiles VARCHAR(50),
    passengers INT,
    fare VARCHAR(50),
    latitude_airport1 VARCHAR(50),
    longitude_airport1 VARCHAR(50),
    latitude_airport2 VARCHAR(50),
    longitude_airport2 VARCHAR(50)
);

-- Copiar los datos de la tabla antigua a la nueva
INSERT INTO Flights_US (date, city1, city2, airport1, airport2, nsmiles, passengers, fare, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2)
SELECT date, city1, city2, airport1, airport2, nsmiles, passengers, fare, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2
FROM Flights_US_Old;

-- Eliminar la tabla antigua
DROP TABLE Flights_US_Old;