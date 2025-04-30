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

const options = {
    method: 'GET',
    url: 'https://aerodatabox.p.rapidapi.com/flights/number/DL47/2025-02-07',
    params: {
      dateLocalRole: 'Both'
    },
    headers: {
      'x-rapidapi-key': '06b34d4afcmsh5cac558248f45d5p190369jsn37aee013c529',
      'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
    }
  };

  // Función para procesar los datos de los vuelos
function processFlightsData(flights) {
    return flights.map(flight => {
        return {
            year: new Date(flight.departure.scheduledTime.utc).getFullYear(), // Año del vuelo
            airport_1: flight.departure.airport.iata, // Código IATA del aeropuerto de salida
            airport_2: flight.arrival.airport.iata, // Código IATA del aeropuerto de llegada
            nsmiles: flight.greatCircleDistance.mile, // Distancia en millas
            geocoded_city1: flight.departure.airport.municipalityName, // Ciudad de salida
            geocoded_city2: flight.arrival.airport.municipalityName, // Ciudad de llegada
            country: flight.departure.airport.countryCode, // País de salida
            country_dest: flight.arrival.airport.countryCode // País de llegada
        };
    });
}

// Función para guardar los datos en la base de datos
async function saveToDatabase(flights) {
    try {
        const pool = await sql.connect(config); // Conectar al pool de conexiones
        const processedFlights = processFlightsData(flights); // Procesar los datos

        for (const flight of processedFlights) {
            // Generar datos aleatorios para passengers y fare
            const passengers = Math.floor(Math.random() * 300) + 50; // Entre 50 y 350 pasajeros
            const fare = (Math.random() * 500).toFixed(2); // Tarifa entre 0 y 500

            const request = pool.request();
            request.input('year', sql.Int, flight.year);
            request.input('airport_1', sql.VarChar, flight.airport_1);
            request.input('airport_2', sql.VarChar, flight.airport_2);
            request.input('nsmiles', sql.Float, flight.nsmiles);
            request.input('passengers', sql.Int, passengers); // Dato aleatorio
            request.input('fare', sql.Float, fare); // Dato aleatorio
            request.input('geocoded_city1', sql.VarChar, flight.geocoded_city1);
            request.input('geocoded_city2', sql.VarChar, flight.geocoded_city2);
            request.input('country', sql.VarChar, flight.country);
            request.input('country_dest', sql.VarChar, flight.country_dest);

            const query = `
                INSERT INTO flights (year, airport_1, airport_2, nsmiles, passengers, fare, geocoded_city1, geocoded_city2, country, country_dest)
                VALUES (@year, @airport_1, @airport_2, @nsmiles, @passengers, @fare, @geocoded_city1, @geocoded_city2, @country, @country_dest)
            `;


            await request.query(query);
            console.log('Datos insertados para el vuelo:', flight);
        }

        // Cerrar el pool de conexiones
        await pool.close();
    } catch (err) {
        console.error('Error al guardar los datos en la base de datos:', err);
    }
}
// Consumir la API
axios.request(options).then(response => {
    const flights = response.data; // Datos obtenidos de la API
    console.log('Datos obtenidos de la API:', flights);

    // Filtrar solo el primer vuelo para pruebas
    const filteredFlights = flights.slice(0, 1); // Solo el primer vuelo
    saveToDatabase(filteredFlights);
}).catch(error => {
    console.error('Error al consumir la API:', error);
});
async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();


