
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


async function barchart2(exportName = "barchart2") {
  try {
    const poolConnection = await sql.connect(config);

    const resultSet = await poolConnection.request().query(`
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
      `);

    const rows = resultSet.recordset;

    const processedData = rows.map(r => ({
      rango:r.Rango_Dist,
      cant:r.Cant_Vuelos
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
barchart2();

async function agregarPreciosPromedioRutas(exportName = "lineChartFlightFareData") {
  try {
    const poolConnection = await sql.connect(config);

    const resultSet = await poolConnection.request().query(`
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
    `);

    const rows = resultSet.recordset;

    const getRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

    const processedData = rows.reduce((acc, r) => {
      let ruta = `${r.origen} 🠮 ${r.destino}`;
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
    console.error("Error al agregar precios promedio por año:", err.message);
  }
}

agregarPreciosPromedioRutas();

async function agregarTopCitiesPieData(exportName = "topCitiesPieData") {
  try {
    const poolConnection = await sql.connect(config);

    const resultSet = await poolConnection.request().query(`
      SELECT TOP 5 f.city2, SUM(f.passengers) AS Cant_Pasajeros
      FROM Flights_US f
      WHERE f.city2 != ''
      GROUP BY f.city2
      ORDER BY Cant_Pasajeros DESC
    `);

    const rows = resultSet.recordset;

    const processedData = rows.map(row => ({
      id: row.city2, 
      label: row.Cant_Pasajeros , 
      value: row.Cant_Pasajeros 
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
    console.error("Error al agregar datos de ciudades populares:", err.message);
  }
}

agregarTopCitiesPieData();

  async function rutasMapa(year = 2021, minPassengers = 5000, exportName = "rutasMapa") { 
    try {
      const poolConnection = await sql.connect(config);
  
      const resultSet = await poolConnection.request().query(`
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
  
      const rows = resultSet.recordset;
  
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
  
      const mockDataPath = './src/data/mockGeo.js';
      const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
      const exportRegex = new RegExp(`export const ${exportName} = (\\[.*?\\]);`, 's');
      const newExport = `export const ${exportName} = ${JSON.stringify(processedData, null, 2)};\n`;
  
      const updatedContent = mockDataContent.includes(`export const ${exportName}`)
        ? mockDataContent.replace(exportRegex, newExport)
        : mockDataContent + '\n' + newExport;
  
      fs.writeFileSync(mockDataPath, updatedContent);
      console.log(`${exportName} actualizado en mockGeo.js`);
  
      poolConnection.close();
    } catch (err) {
      console.error("Error al agregar rutas de vuelo para el mapa:", err.message);
    }
  }
  
  rutasMapa(2024, 3000, "rutasMapa");