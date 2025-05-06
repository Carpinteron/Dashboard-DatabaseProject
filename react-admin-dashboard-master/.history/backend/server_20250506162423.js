const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const WebSocket = require("ws");
const axios = require('axios'); //npm install axios --legacy-peer-deps
const fs = require("fs"); // Para leer archivos SQL
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
  options: { encrypt: false, trustServerCertificate: true }, requestTimeout: 120000 // 30 segundos
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
async function saveFilteredFlightsToDatabase(flights, airportOriginIataCode, fecharequest) {
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
        passengers:getRandomInt(20,100), // Pasajeros como null
        fare: getRandomInt(19,1200).toString(), // Tarifa como null
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
  }
}


//Consumir API de vuelos
async function Api_lol(fecha, IataCode) {
  console.log('Llamando a la API...');
  let airportOriginIataCode = IataCode // Código IATA del aeropuerto de origen
  let fecharequest = fecha // YYYY-MM-DD  
  const options = {
    method: 'GET',
    url: 'https://aerodatabox.p.rapidapi.com/airports/iata/' + airportOriginIataCode + '/stats/routes/daily/' + fecharequest,
    headers: {
      'x-rapidapi-key': '7720730466msh9912ee7fb645912p1031eajsnca000b1b74be',
      'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
    }
  };
  // Consumir la API y procesar los datos
  axios.request(options).then(response => {
    const flights = response.data.routes; // Obtener las rutas de la API
    console.log('Datos obtenidos de la API:)');
    saveFilteredFlightsToDatabase(flights, airportOriginIataCode, fecharequest); // Guardar los vuelos filtrados en la base de datos
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

// 4. Top ciudades visitadas (pie chart)
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

// 4. Top ciudades salidas (pie chart)
app.get('/api/top-ciudades-origen', async (req, res) => {
  try {
    const result = await pool.request().query(`
        select top 5 f.city1, sum(f.passengers) as Cant_Pasajeros
        from Flights_US f
        where f.city1!=''
        group by f.city1
        order by Cant_Pasajeros desc
      `); // Tu SQL para topCitiesPieData
    const rows = result.recordset;

    const processedData = rows.map(row => ({
      id: row.city1,
      label: row.city1,
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
  const minPassengers = parseInt(req.query.minPassengers)  || 3000; // Valor por defecto si no se proporciona

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
    console.log("Datos encontrados en la base de datos. Devolviendo datos...", processedData);
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
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
  const airportOriginIataCode = req.query.airportOriginIataCode;
  const forceUpdate = req.query.forceUpdate === 'true';

   // 👇 Imprime en consola los datos recibidos
   console.log("📥 Datos recibidos en /api/rutas-mapa2:");
   console.log("Fecha:", fecha);
   console.log("airportOriginIataCode:", airportOriginIataCode);
   console.log("forceUpdate:", forceUpdate);
  try {
    if (forceUpdate) {
      const result = await pool.request()
        .input('fecha', sql.Date, fecha)
        .input('airportOriginIataCode', sql.VarChar, airportOriginIataCode)
        .query(`
          SELECT city1, city2, airport1, airport2, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2
          FROM Flights_US
          WHERE date = @fecha AND airport1 = @airportOriginIataCode;
        `);

      const rows = result.recordset;

      if (rows.length > 0) {
        
        // Procesar los datos para el mapa
        const processedData = rows.map(r => ({
          from: r.airport1,
          to: r.airport2,
          cityFrom: r.city1,
          cityTo: r.city2,
          lat1: r.latitude_airport1,
          lon1: r.longitude_airport1,
          lat2: r.latitude_airport2,
          lon2: r.longitude_airport2
        }));
        console.log("Datos encontrados en la base de datos. Devolviendo datos...", processedData);
        return res.json(processedData);
      }
    }

    console.log("No se encontraron datos en la base de datos. Llamando a la API...");
    const flights = await Api_lol(fecha, airportOriginIataCode);

    if (flights && flights.length > 0) {
      // vuelve a consultar la base de datos para devolver los nuevos datos
      const retryResult = await pool.request()
        .input('fecha', sql.Date, fecha)
        .input('airportOriginIataCode', sql.VarChar, airportOriginIataCode)
        .query(`
          SELECT city1, city2, airport1, airport2, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2
          FROM Flights_US
          WHERE date = @fecha AND airport1 = @airportOriginIataCode;
        `);

      const retryRows = retryResult.recordset;

      if (retryRows.length > 0) {
        const processedRetryData = retryRows.map(r => ({
          from: r.airport1,
          to: r.airport2,
          cityFrom: r.city1,
          cityTo: r.city2,
          lat1: r.latitude_airport1,
          lon1: r.longitude_airport1,
          lat2: r.latitude_airport2,
          lon2: r.longitude_airport2
        }));

        return res.json(processedRetryData);
      }
    }

    res.status(404).send("No se encontraron datos después de consultar la API.");
  } catch (err) {
    console.error("Error en rutas-mapa:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

app.get('/api/infogeneral1', async (req, res) => {
  try {
    const result = await pool.request().query(`
      select count(*) as totalvuelos
      from Flights_US f
    `);

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

// 7. Información general (distancia promedio)
app.get('/api/infogeneral2', async (req, res) => {
  try {
    const result = await pool.request().query(`
      select avg(cast(f.nsmiles as float)) as avgdistancia
from Flights_US f
    `);

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

// 8. Información general (total de aeropuertos)
app.get('/api/infogeneral3', async (req, res) => {
  try {
    const result = await pool.request().query(`
      with Aeropuertos as (
    select f.airport1 as aeropuerto
	from Flights_US f
    union 
    select f.airport2 
	from Flights_US f
)
select count(*) totalaeropuertos
from Aeropuertos;
    `);

    res.json({
      success: true,
      data: {
        totalaeropuertos: result.recordset[0].totalaeropuertos
      }
    });
  } catch (err) {
    console.error("Error al obtener el total de aeropuertos:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});

// 9. Información general (precio promedio)
app.get('/api/infogeneral4', async (req, res) => {
  try {
    const result = await pool.request().query(`
      select avg(cast(f.fare as float)) as avgprecio
from Flights_US f
    `);

    res.json({
      success: true,
      data: {
        avgprecio: result.recordset[0].avgprecio
      }
    });
  } catch (err) {
    console.error("Error al obtener el precio promedio:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});
// 10. Información general (cantidad de vuelos por año)
app.get('/api/vuelos-enero-mayo-2025', async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        MONTH(f.date) AS Mes,
        DATENAME(MONTH, f.date) AS NombreMes,
        COUNT(*) AS Cant_Vuelos
      FROM Flights_US f
      WHERE YEAR(f.date) = 2025 AND MONTH(f.date) BETWEEN 1 AND 5
      GROUP BY MONTH(f.date), DATENAME(MONTH, f.date)
      ORDER BY Mes ASC
    `);

    const rawData = result.recordset;

    // Mapeo fijo enero-mayo
    const mesesEsperados = [
      { Mes: 1, NombreMes: "Enero" },
      { Mes: 2, NombreMes: "Febrero" },
      { Mes: 3, NombreMes: "Marzo" },
      { Mes: 4, NombreMes: "Abril" },
      { Mes: 5, NombreMes: "Mayo" },
    ];

    const dataCompleta = mesesEsperados.map(({ Mes, NombreMes }) => {
      const encontrado = rawData.find((m) => m.Mes === Mes);
      return {
        Mes,
        NombreMes,
        Cant_Vuelos: encontrado ? encontrado.Cant_Vuelos : 0,
      };
    });

    res.json({
      success: true,
      data: dataCompleta,
    });
    console.log("Datos de enero a mayo 2025:", dataCompleta);
  } catch (err) {
    console.error("Error al obtener los vuelos de enero a mayo 2025:", err.message);
    res.status(500).send("Error interno del servidor");
  }
});




// Cerrar el pool de conexiones al apagar el servidor
process.on('SIGINT', async () => {
  console.log("🛑 Apagando el servidor...");
  if (pool) {
    try {
      await pool.close();
      console.log("✅ Pool de conexiones cerrado correctamente.");
    } catch (err) {
      console.error("❌ Error al cerrar el pool de conexiones:", err.message);
    }
  }
  process.exit(0);
});


// Arranca el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
