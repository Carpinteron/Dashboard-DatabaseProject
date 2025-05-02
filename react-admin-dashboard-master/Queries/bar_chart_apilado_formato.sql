WITH rutas_populares AS (
    SELECT TOP 5 f.airport1 AS origen, f.airport2 AS destino
    FROM Flights_US f
    GROUP BY f.airport1, f.airport2
    ORDER BY SUM(f.passengers) DESC
),
datos_agrupados AS (
    SELECT 
        year(f.date) AS year,
        CONCAT(f.airport1, ' - ', f.airport2) AS ruta,
        SUM(f.passengers) AS cant_pasajeros_anual
    FROM Flights_US f
    JOIN rutas_populares r ON r.origen = f.airport1 AND r.destino = f.airport2
    WHERE year(f.date) >= 2020
    GROUP BY year(f.date), f.airport1, f.airport2
)

SELECT 
    d.year as year,
    SUM(CASE WHEN d.ruta = r1.ruta THEN d.cant_pasajeros_anual ELSE 0 END) AS Ruta_1,
    SUM(CASE WHEN d.ruta = r2.ruta THEN d.cant_pasajeros_anual ELSE 0 END) AS Ruta_2,
    SUM(CASE WHEN d.ruta = r3.ruta THEN d.cant_pasajeros_anual ELSE 0 END) AS Ruta_3,
    SUM(CASE WHEN d.ruta = r4.ruta THEN d.cant_pasajeros_anual ELSE 0 END) AS Ruta_4,
    SUM(CASE WHEN d.ruta = r5.ruta THEN d.cant_pasajeros_anual ELSE 0 END) AS Ruta_5
FROM datos_agrupados d
CROSS JOIN (SELECT CONCAT(origen, ' - ', destino) AS ruta FROM rutas_populares ORDER BY origen OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY) r1
CROSS JOIN (SELECT CONCAT(origen, ' - ', destino) AS ruta FROM rutas_populares ORDER BY origen OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY) r2
CROSS JOIN (SELECT CONCAT(origen, ' - ', destino) AS ruta FROM rutas_populares ORDER BY origen OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY) r3
CROSS JOIN (SELECT CONCAT(origen, ' - ', destino) AS ruta FROM rutas_populares ORDER BY origen OFFSET 3 ROWS FETCH NEXT 1 ROWS ONLY) r4
CROSS JOIN (SELECT CONCAT(origen, ' - ', destino) AS ruta FROM rutas_populares ORDER BY origen OFFSET 4 ROWS FETCH NEXT 1 ROWS ONLY) r5
GROUP BY d.year
ORDER BY d.year;