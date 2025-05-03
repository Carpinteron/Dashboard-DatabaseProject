// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3001; // Cambia si es necesario

// Configuración de la base de datos
const config = {
  user: 'adminsql',
  password: 'NIPS-lab#1',
  server: 'servidorskysql.database.windows.net',
  database: 'FlightsData',
  port: 1433,
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Conexión única (pool)
let pool;
sql.connect(config).then(p => {
  pool = p;
  console.log("Conectado a la base de datos SQL Server");
}).catch(err => {
  console.error("Error de conexión:", err.message);
});

// --- Rutas ---

// 1. Rutas populares por año
app.get('/api/rutas-populares', async (req, res) => {
  try {
    const result = await pool.request().query(`
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

      `); // (Aquí va tu SQL de rutas populares)
    const rows = result.recordset;

    const processedData = rows.map(r => ({
      year: r.year,
      "HNL 🠮 ITO": r.Ruta_1,
      "LAS 🠮 RNO": r.Ruta_2,
      "LAX 🠮 RNO": r.Ruta_3,
      "PHX 🠮 RNO": r.Ruta_4,
      "SEA 🠮 RNO": r.Ruta_5,
    }));

    res.json(processedData);
  } catch (err) {
    console.error("Error al obtener rutas populares:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

// 2. Barchart por rangos de distancia
app.get('/api/barchart2', async (req, res) => {
  try {
    const result = await pool.request().query(`
select
    case
        when cast(f.nsmiles as float) < 1000 then '0-1000'
        when cast(f.nsmiles as float) between 1000 and 2000 then '1000-2000'
        else '2000+'  
    end as Rango_Dist,
    count(*) as Cant_Vuelos
from Flights_US f
group by
    case
        when cast(f.nsmiles as float) < 1000 then '1'
        when cast(f.nsmiles as float) between 1000 and 2000 then '2'
        else '3' 
	end,
    case
        when cast(f.nsmiles as float) < 1000 then '0-1000'
        when cast(f.nsmiles as float) between 1000 and 2000 then '1000-2000'
        else '2000+' 
    end
order by
    case
        when cast(f.nsmiles as float) < 1000 then '1'
        when cast(f.nsmiles as float) between 1000 and 2000 then '2'
        else '3' 
	end
      `); // Tu SQL de barchart2
    const rows = result.recordset;

    const processedData = rows.map(r => ({
      rango: r.Rango_Dist,
      cant: r.Cant_Vuelos
    }));

    res.json(processedData);
  } catch (err) {
    console.error("Error en barchart2:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

// 3. Precios promedio de rutas
app.get('/api/precios-promedio', async (req, res) => {
  try {
    const result = await pool.request().query(`
      WITH rutas_concurridas AS (    
        SELECT TOP 5 f.airport1 AS origen, f.airport2 AS destino, COUNT(*) AS cant
        FROM Flights_US f
        GROUP BY f.airport1, f.airport2
        ORDER BY cant DESC
      )
      SELECT YEAR(f.date) AS year, rc.origen, rc.destino, AVG(cast(f.fare as float)) AS Precio_Promedio_Anual
      FROM rutas_concurridas rc
      JOIN Flights_US f ON f.airport1 = rc.origen AND f.airport2 = rc.destino
      GROUP BY YEAR(f.date), rc.origen, rc.destino
      ORDER BY YEAR(f.date);
    `); // Tu SQL de precios promedio
    const rows = result.recordset;

    const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const processedData = rows.reduce((acc, r) => {
      const ruta = `${r.origen} 🠮 ${r.destino}`;
      let rutaObj = acc.find(obj => obj.id === ruta);
      if (!rutaObj) {
        rutaObj = { id: ruta, color: getRandomColor(), data: [] };
        acc.push(rutaObj);
      }

      const lastEntry = rutaObj.data[rutaObj.data.length - 1];

      rutaObj.data.push({
        x: r.year.toString(),
        y: r.Precio_Promedio_Anual ? parseFloat(r.Precio_Promedio_Anual.toFixed(2)) : (lastEntry ? lastEntry.y : 0)
      });

      return acc;
    }, []);

    res.json(processedData);
  } catch (err) {
    console.error("Error en precios promedio:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

// 4. Top ciudades (ejemplo incompleto)
app.get('/api/top-ciudades', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT TOP 5 f.city2, SUM(f.passengers) AS Cant_Pasajeros
      FROM Flights_US f
      WHERE f.city2 != ''
      GROUP BY f.city2
      ORDER BY Cant_Pasajeros DESC
    `); // Tu SQL para topCitiesPieData
    const rows = result.recordset;

    const processedData = rows.map(row => ({
      id: row.city2,
      label: row.city2,
      value: row.Cant_Pasajeros
    }));

    res.json(processedData);
  } catch (err) {
    console.error("Error en top ciudades:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});
// Ruta: Rutas para el mapa
app.get('/api/rutas-mapa', async (req, res) => {
    const year = parseInt(req.query.year) || 2021;
    const minPassengers = parseInt(req.query.minPassengers) || 5000;
  
    try {
      const result = await pool.request().query(`
        SELECT  
          city1,
          city2,
          airport1,
          airport2,
          latitude_airport1,
          longitude_airport1,
          latitude_airport2,
          longitude_airport2,
          SUM(passengers) AS total_passengers
        FROM Flights_US
        WHERE YEAR(date) = ${year}
        GROUP BY  
          city1, city2,
          airport1, airport2,  
          latitude_airport1, longitude_airport1,  
          latitude_airport2, longitude_airport2
        HAVING SUM(passengers) > ${minPassengers};
      `);
  
      const rows = result.recordset;
  
      const processedData = rows.map(r => ({
        from: r.airport1,
        to: r.airport2,
        cityFrom: r.city1,
        cityTo: r.city2,
        lat1: r.latitude_airport1,
        lon1: r.longitude_airport1,
        lat2: r.latitude_airport2,
        lon2: r.longitude_airport2,
        passengers: r.total_passengers
      }));
  
      res.json(processedData);
    } catch (err) {
      console.error("Error en rutas-mapa:", err.message);
      res.status(500).send("Error interno del servidor");
    }
  });
  
// Servidor escuchando
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario_mysql',
  password: 'tu_contraseña',
  database: 'tu_basededatos'
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Ruta de prueba
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Arranca el servidor
app.listen(3001, () => {
  console.log('Servidor backend corriendo en http://localhost:3001');
});
