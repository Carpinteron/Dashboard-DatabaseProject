const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración SQL Server
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

// Conexión a SQL Server
let pool;
sql.connect(config).then(p => {
  pool = p;
  console.log("✅ Conectado a SQL Server");
}).catch(err => {
  console.error("❌ Error de conexión:", err.message);
});

// Ruta de prueba de conexión
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT TOP 1 * FROM Flights_US');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error ejecutando consulta");
  }
});

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de la API!');
});

// Arranca el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
