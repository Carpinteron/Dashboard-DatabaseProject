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

const fs = require('fs');
console.log("Starting...");



async function agregarRutasPopularesPorAnio(exportName = "rutasPopularesPorAnio") {
  try {
    const poolConnection = await sql.connect(config);

    const resultSet = await poolConnection.request().query(`
  WITH rutas_populares AS (
    SELECT TOP 5 f.airport1 AS origen, f.airport2 AS destino
    FROM Flights_US_Backup f
    GROUP BY f.airport1, f.airport2
    ORDER BY SUM(f.passengers) DESC
),
datos_agrupados AS (
    SELECT 
        f.year,
        CONCAT(f.airport1, ' - ', f.airport2) AS ruta,
        SUM(f.passengers) AS cant_pasajeros_anual
    FROM Flights_US_Backup f
    JOIN rutas_populares r ON r.origen = f.airport1 AND r.destino = f.airport2
    WHERE f.year >= 2015
    GROUP BY f.year, f.airport1, f.airport2
)

SELECT 
    d.year,
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

      `);

    const rows = resultSet.recordset;

    const processedData = rows.map(r => ({
      year: r.year,
      "HNL 🠮 ITO":r.Ruta_1,
      "LAS 🠮 RNO":r.Ruta_2,
      "LAX 🠮 RNO":r.Ruta_3,
      "PHX 🠮 RNO":r.Ruta_4,
      "SEA 🠮 RNO":r.Ruta_5,
    }));

    const mockDataPath = './src/data/mockData.js';
    const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

    const exportRegex = new RegExp(`export const ${exportName} = (\\[.*?\\]);`, 's');
    const newExport = `export const ${exportName} = ${JSON.stringify(processedData, null, 2)};\n`;

    const updatedContent = mockDataContent.includes(`export const ${exportName}`)
      ? mockDataContent.replace(exportRegex, newExport)
      : mockDataContent + '\n' + newExport;

    fs.writeFileSync(mockDataPath, updatedContent);
    console.log(`${exportName} actualizado en mockData.js`);

    poolConnection.close();
  } catch (err) {
    console.error("Error al agregar rutas populares por año:", err.message);
  }
}

agregarRutasPopularesPorAnio();

