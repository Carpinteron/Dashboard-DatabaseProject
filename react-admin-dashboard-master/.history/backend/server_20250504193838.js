const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const WebSocket = require("ws");
const axios = require('axios'); //npm install axios --legacy-peer-deps

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

// Configuración SQL Server
const config = {
  user: "sqluser",
  password: "NIPS-lab#1",
  server: "localhost",
  database: "Flights_Data",
  port: 1433,
  authentication: { type: "default" },
  options: { encrypt: false, trustServerCertificate: true },
};

// Conexión a SQL Server
let pool;
async function connectToDatabase() {
  try {
    pool = await sql.connect(config);
    console.log("✅ Conectado a SQL Server local");
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    process.exit(1); // Termina la aplicación si no puede conectar
  }
}
connectToDatabase();

//Funciones auxiliares
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const toRadians = (deg) => deg * Math.PI / 180;

  const dlat = toRadians(lat2 - lat1);
  const dlon = toRadians(lon2 - lon1);

  const a = Math.sin(dlat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dlon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanciaKm = R * c;
  const distanciaMillas = distanciaKm * 0.621371;

  return {
    km: distanciaKm,
    millas: distanciaMillas
  };
}

async function saveFilteredFlightsToDatabase(flights) {
  let pool; // Declarar pool aquí para que esté accesible en el bloque finally
  try {
    pool = await sql.connect(config); // Conectar al pool de conexiones

    // Obtener los aeropuertos de Estados Unidos desde la tabla AIRPORTS
    const airportsResult = await pool.request().query(`
            SELECT IATA as iata, Nombre AS name, Ciudad AS city, Pais AS country, Latitud AS lat, Longitud AS lon
            FROM Airports_US;
        `);
    const usAirports = airportsResult.recordset.reduce((acc, airport) => {
      acc[airport.iata] = airport; // Crear un mapa con el IATA como clave
      return acc;
    }, {});

    // Filtrar los vuelos que tienen destino en aeropuertos de Estados Unidos
    const filteredFlights = flights.filter(flight => {
      const destinationIata = flight.destination?.iata; // Validar que exista flight.destination.iata
      return destinationIata && usAirports[destinationIata]; // Solo incluir si el IATA está en la tabla AIRPORTS
    });

    for (const flight of filteredFlights) {
      const destinationIata = flight.destination.iata;
      const destinationAirport = usAirports[destinationIata];
      const originAirport = usAirports[airportOriginIataCode];

      if (!originAirport) {
        console.error(`El aeropuerto de origen (${airportOriginIataCode}) no se encuentra en la tabla AIRPORTS.`);
        continue;
      }

      // Calcular la distancia entre los aeropuertos
      const distancia = calcularDistancia(
        originAirport.lat,
        originAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon
      );

      // Preparar los datos para insertar en la tabla FLIGHTS
      const flightData = {
        date: fecharequest,
        city1: originAirport.city,
        city2: destinationAirport.city,
        airport1: originAirport.iata,
        airport2: destinationAirport.iata,
        nsmiles: distancia.millas.toString(), // Convertir a string
        passengers: null, // Pasajeros como null
        fare: null, // Tarifa como null
        latitude_airport1: originAirport.lat,
        longitude_airport1: originAirport.lon,
        latitude_airport2: destinationAirport.lat,
        longitude_airport2: destinationAirport.lon
      };

      // Verificar si ya existe un vuelo con el mismo origen, destino y fecha
      const existingFlight = await pool.request()
        .input('date', sql.Date, flightData.date)
        .input('airport1', sql.VarChar, flightData.airport1)
        .input('airport2', sql.VarChar, flightData.airport2)
        .query(`
                SELECT 1
                FROM Flights_US
                WHERE date = @date AND airport1 = @airport1 AND airport2 = @airport2
            `);

      if (existingFlight.recordset.length > 0) {
        console.log('Vuelo duplicado, no se insertó:', flightData);
        continue; // Saltar este vuelo
      }
      // Insertar el vuelo en la base de datos
      const request = pool.request();
      request.input('date', sql.Date, flightData.date);
      request.input('city1', sql.VarChar, flightData.city1);
      request.input('city2', sql.VarChar, flightData.city2);
      request.input('airport1', sql.VarChar, flightData.airport1);
      request.input('airport2', sql.VarChar, flightData.airport2);
      request.input('nsmiles', sql.VarChar, flightData.nsmiles);
      request.input('passengers', sql.Int, flightData.passengers);
      request.input('fare', sql.VarChar, flightData.fare);
      request.input('latitude_airport1', sql.VarChar, flightData.latitude_airport1);
      request.input('longitude_airport1', sql.VarChar, flightData.longitude_airport1);
      request.input('latitude_airport2', sql.VarChar, flightData.latitude_airport2);
      request.input('longitude_airport2', sql.VarChar, flightData.longitude_airport2);

      const query = `
                INSERT INTO Flights_US (date, city1, city2, airport1, airport2, nsmiles, passengers, fare, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2)
                VALUES (@date, @city1, @city2, @airport1, @airport2, @nsmiles, @passengers, @fare, @latitude_airport1, @longitude_airport1, @latitude_airport2, @longitude_airport2)
            `;

      await request.query(query);
      console.log('Vuelo insertado:');
    }

  } catch (err) {
    console.error('Error al guardar los vuelos filtrados en la base de datos:', err);
  } finally {
    if (pool) {
      await pool.close(); // Cerrar el pool de conexiones
    }
  }
}

//Consumir API de vuelos
async function Api_lol(fecha, IataCode) {
  let airportOriginIataCode = IataCode // Código IATA del aeropuerto de origen
  let fecharequest = fecha // YYYY-MM-DD  
  const options = {
    method: 'GET',
    url: 'https://aerodatabox.p.rapidapi.com/airports/iata/' + airportOriginIataCode + '/stats/routes/daily/' + fecharequest,
    headers: {
      'x-rapidapi-key': '06b34d4afcmsh5cac558248f45d5p190369jsn37aee013c529',
      'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
    }
  };
  // Consumir la API y procesar los datos
  axios.request(options).then(response => {
    const flights = response.data.routes; // Obtener las rutas de la API
    console.log('Datos obtenidos de la API:)');
    saveFilteredFlightsToDatabase(flights); // Guardar los vuelos filtrados en la base de datos
  }).catch(error => {
    console.error('Error al consumir la API:', error);
  });
}

// 1. Rutas populares por año barchart apilado
app.get('/api/rutas-populares', async (req, res) => {
  const year1 = parseInt(req.query.year1) || 2020;
  const year2 = parseInt(req.query.year2) || 2025;
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
      WHERE year(f.date) >= ${year1} and year(f.date) <= ${year2}
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
  const year1 = parseInt(req.query.year1) || 2020;
  const year2 = parseInt(req.query.year2) || 2025;
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
        WHERE year(f.date) >= ${year1} and year(f.date) <= ${year2}
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

// 4. Top ciudades salidas
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
      const year = parseInt(req.query.year) || 2024;
      const minPassengers = parseInt(req.query.minPassengers) || 3000;
    
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

// 5. Lista de vuelos ordenados por fecha (descendente)
app.get('/api/lista-vuelos', async (req, res) => {
  try {
    const result = await pool.request().query(`
        SELECT top 10 f.id, f.date, f.airport1, f.airport2, f.city1, f.city2
        FROM Flights_US f
        ORDER BY f.date DESC
      `);

    const rows = result.recordset;

    res.json(rows);
  } catch (err) {
    console.error("Error en lista-vuelos:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

//mapa dos
// Ruta: Rutas para el mapa
app.get('/api/rutas-mapa2', async (req, res) => {
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];;
  const airportOriginIataCode = req.query.airportOriginIataCode || 'JFK'; // Cambia esto por el código IATA del aeropuerto de origen que desees

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
    longitude_airport2
FROM Flights_US
WHERE date = ${fecha}  -- Filtro por fecha
    AND airport1 = ${airportOriginIataCode};   -- Filtro por aeropuerto de origen
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


// 6. Información general (total de vuelos)
app.get('/api/infogeneral1', async (req, res) => {
  try {
    const result = await pool.request().query(`
      select count(*) as totalvuelos
      from Flights_US f
    `);

    const rows = result.recordset;
    const processedData = rows.map(r => ({
      totalvuelos: r.totalvuelos
    }));

    res.json({
      success: true,
      data: {
        totalvuelos: result.recordset[0].totalvuelos
      }
    });
  } catch (err) {
    console.error("Error al obtener el total de vuelos:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

// 7. Información general (distancia promedio
app.get('/api/infogeneral2', async (req, res) => {
  try {
    const query = fs.readFileSync("./Queries/queries_franja.sql", "utf8");
    const result = await pool.request().query(query);

    const rows = result.recordset;
    const processedData = rows.map(r => ({
      avgdistancia: r.avgdistancia
    }));

    res.json({
      success: true,
      data: {
        avgdistancia: result.recordset[0].avgdistancia
      }
    });
  } catch (err) {
    console.error("Error al obtener la distancia promedio:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});


// Arranca el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
