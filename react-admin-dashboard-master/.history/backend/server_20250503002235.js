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
    const result = await pool.request().query(`...`); // (Aquí va tu SQL de rutas populares)
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
    const result = await pool.request().query(`...`); // Tu SQL de barchart2
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
    const result = await pool.request().query(`...`); // Tu SQL de precios promedio
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
    const result = await pool.request().query(`...`); // Tu SQL para topCitiesPieData
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
