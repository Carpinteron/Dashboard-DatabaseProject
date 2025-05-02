const axios = require('axios'); //npm install axios --legacy-peer-deps
const sql = require('mssql');

const config = {
    user: 'adminsql', // better stored in an app setting such as process.env.DB_USER
    password: 'NIPS-lab#1', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'servidorskysql.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'FlightsData', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

let airportOriginIataCode='LAX' // Código IATA del aeropuerto de origen
let fecharequest='2024-10-01' // YYYY-MM-DD
const options = {
    method: 'GET',
    url: 'https://aerodatabox.p.rapidapi.com/airports/iata/'+airportOriginIataCode+'/stats/routes/daily/'+fecharequest,
    headers: {
      'x-rapidapi-key': '06b34d4afcmsh5cac558248f45d5p190369jsn37aee013c529',
      'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
    }
  };

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
            const destinationIata = flight.destination.iata;
            return usAirports[destinationIata]; // Solo incluir si el IATA está en la tabla AIRPORTS
        });

        for (const flight of filteredFlights) {
            const destinationIata = flight.destination.iata;
            const destinationAirport = usAirports[destinationIata];

            // Obtener información del aeropuerto de origen desde la tabla AIRPORTS
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
            const fecha = fecharequest;
            const flightData = {
                fecha,
                city1: originAirport.city,
                city2: destinationAirport.city,
                airport1: originAirport.iata,
                airport2: destinationAirport.iata,
                nsmiles: distancia.millas,
                passengers: null, // Pasajeros como null
                fare: null, // Tarifa como null
                latitude_airport1: originAirport.lat,
                longitude_airport1: originAirport.lon,
                latitude_airport2: destinationAirport.lat,
                longitude_airport2: destinationAirport.lon
            };

            // Verificar si ya existe un vuelo con el mismo origen, destino y fecha
            const existingFlight = await pool.request()
            .input('flight_date', sql.Date, flightData.fecha)
            .input('airport1', sql.VarChar, flightData.airport1)
            .input('airport2', sql.VarChar, flightData.airport2)
            .query(`
                SELECT 1
                FROM Flights_US
                WHERE date = @flight_date AND airport1 = @airport1 AND airport2 = @airport2
            `);

        if (existingFlight.recordset.length > 0) {
            console.log('Vuelo duplicado, no se insertó:', flightData);
            continue; // Saltar este vuelo
        }
            // Insertar el vuelo en la base de datos
            const request = pool.request();
            request.input('date', sql.Date, flightData.fecha);
            request.input('city1', sql.VarChar, flightData.city1);
            request.input('city2', sql.VarChar, flightData.city2);
            request.input('airport1', sql.VarChar, flightData.airport1);
            request.input('airport2', sql.VarChar, flightData.airport2);
            request.input('nsmiles', sql.Float, flightData.nsmiles);
            request.input('passengers', sql.Int, flightData.passengers);
            request.input('fare', sql.Float, flightData.fare);
            request.input('latitude_airport1', sql.Float, flightData.latitude_airport1);
            request.input('longitude_airport1', sql.Float, flightData.longitude_airport1);
            request.input('latitude_airport2', sql.Float, flightData.latitude_airport2);
            request.input('longitude_airport2', sql.Float, flightData.longitude_airport2);

            const query = `
                INSERT INTO Flights_US (date, city1, city2, airport1, airport2, nsmiles, passengers, fare, latitude_airport1, longitude_airport1, latitude_airport2, longitude_airport2)
                VALUES (@date, @city1, @city2, @airport1, @airport2, @nsmiles, @passengers, @fare, @latitude_airport1, @longitude_airport1, @latitude_airport2, @longitude_airport2)
            `;

            await request.query(query);
            console.log('Vuelo insertado:');
        }

    } catch (err) {
        console.error('Error al guardar los vuelos filtrados en la base de datos:', err);
    }finally {
        if (pool) {
            await pool.close(); // Cerrar el pool de conexiones
        }
    }
}


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


// Consumir la API y procesar los datos
axios.request(options).then(response => {
    const flights = response.data.routes; // Obtener las rutas de la API
    console.log('Datos obtenidos de la API:)');

    saveFilteredFlightsToDatabase(flights); // Guardar los vuelos filtrados en la base de datos
}).catch(error => {
    console.error('Error al consumir la API:', error);
});
