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

/*
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-vm'
        },
        options: {
            encrypt: true
        }
    }

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-app-service'
        },
        options: {
            encrypt: true
        }
    }
*/
const fs = require('fs');
console.log("Starting...");
//connectAndQuery();
agregarinfo('mockTransactions'); 

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`
           select distinct F.country
from Flights F
where F.country like 'A%'`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = Object.keys(resultSet.recordset[0]).join(", ");
        console.log("Columns: ", columns);

        // output row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log(row);
        });

        // Datos obtenidos del query
        const data = resultSet.recordset;

        // Leer el contenido actual de mockData.js
        const mockDataPath = './src/data/mockData.js';
        const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

         // Verificar si ya existe mockQueryData en el archivo
         if (mockDataContent.includes('export const mockQueryData')) {
            // Reemplazar el contenido existente de mockQueryData
            const updatedContent = mockDataContent.replace(
                /export const mockQueryData = \[.*?\];/s,
                `export const mockQueryData = ${JSON.stringify(data, null, 2)};`
            );
            fs.writeFileSync(mockDataPath, updatedContent);
            console.log("mockQueryData actualizado en mockData.js!");
        } else {
            // Agregar los nuevos datos al archivo
            const newData = `export const mockQueryData = ${JSON.stringify(data, null, 2)};\n`;
            const updatedContent = mockDataContent + '\n' + newData;
            // Escribir el contenido actualizado en mockData.js
            fs.writeFileSync(mockDataPath, updatedContent);
            console.log("mockQueryData agregado a mockData.js!");
        }

        // close connection only when we're certain application is finished
        poolConnection.close();

    } catch (err) {
        console.error(err.message);
    }
}

async function agregarinfo(exportName) {
    try {
        var poolConnection = await sql.connect(config);

        console.log(`Reading rows from the Table for ${exportName}...`);
        var resultSet = await poolConnection.request().query(`
            select top 3
                F.country as name,
                F.country as email,
                F.nsmiles as phone,
                F.year as access
            from Flights F
            where F.country like 'A%'
            group by F.country, F.airport_2, F.nsmiles, F.year;
        `);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // Datos obtenidos del query
        const newData = resultSet.recordset;

        // Mapear los datos para que coincidan con la estructura esperada
        const processedData = newData.map(item => ({
            txId: item.name, // Mapear 'name' a 'txId'
            user: item.email, // Mapear 'email' a 'user'
            date: String(item.access), // Mapear 'access' a 'date' como string
            cost: parseFloat(item.phone).toFixed(2), // Mapear 'phone' a 'cost' y formatear como número decimal
        }));

        console.log("Datos procesados:", processedData);

        // Leer el contenido actual de mockData.js
        const mockDataPath = './src/data/mockData.js';
        const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

        // Verificar si el exportName existe en el archivo
        const exportRegex = new RegExp(`export const ${exportName} = (\\[.*?\\]);`, 's');
        const existingDataMatch = mockDataContent.match(exportRegex);

        if (existingDataMatch) {
            try {
                // Extraer y analizar los datos existentes
                const rawArrayText = existingDataMatch[1];

// Convertir el array de texto JS a objeto usando "eval" de forma segura
                const existingData = eval('(' + rawArrayText + ')');

                console.log("Datos existentes en mockTransactions:", existingData);

                // Combinar los datos existentes con los nuevos
                const combinedData = [...existingData, ...processedData];

                // Reemplazar el contenido del exportName con los datos combinados
                const updatedContent = mockDataContent.replace(
                    exportRegex,
                    `export const ${exportName} = ${JSON.stringify(combinedData, null, 2)};`
                );
                fs.writeFileSync(mockDataPath, updatedContent);
                console.log(`${exportName} actualizado con nuevos registros en mockData.js!`);
            } catch (err) {
                console.error("Error al analizar los datos existentes:", err.message);
            }
        } else {
            // Si no existe el exportName, agregarlo desde cero
            const newExport = `export const ${exportName} = ${JSON.stringify(processedData, null, 2)};\n`;
            const updatedContent = mockDataContent + '\n' + newExport;
            fs.writeFileSync(mockDataPath, updatedContent);
            console.log(`${exportName} agregado a mockData.js!`);
        }

        // Cerrar la conexión
        poolConnection.close();

    } catch (err) {
        console.error("Error:", err.message);
    }
}
// QUERY #1 
async function agregarLineChartFlightFareData(exportName = "lineChartFlightFareData") {
    try {
      const poolConnection = await sql.connect(config);
  
      const resultSet = await poolConnection.request().query(`
        SELECT 
          year AS Year, 
          AVG(CAST(fare AS FLOAT)) AS Average_Fare, 
          COUNT(*) AS Flights_per_year
        FROM Flights 
        GROUP BY year
        ORDER BY year ASC;
      `);
  
      const rows = resultSet.recordset;
  
      const tarifaPromedio = {
        id: "Tarifa Promedio",
        data: rows.map(r => ({
          x: String(r.Year),
          y: parseFloat(r.Average_Fare)
        }))
      };
  
      const cantidadVuelos = {
        id: "Cantidad de Vuelos",
        data: rows.map(r => ({
          x: String(r.Year),
          y: parseInt(r.Flights_per_year)
        }))
      };
  
      const finalData = [tarifaPromedio, cantidadVuelos];
  
      // Leer mockData.js
      const mockDataPath = './src/data/mockData.js';
      const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
      const exportRegex = new RegExp(`export const ${exportName} = (\\[.*?\\]);`, 's');
      const updatedContent = mockDataContent.includes(`export const ${exportName}`)
        ? mockDataContent.replace(exportRegex, `export const ${exportName} = ${JSON.stringify(finalData, null, 2)};`)
        : mockDataContent + `\nexport const ${exportName} = ${JSON.stringify(finalData, null, 2)};\n`;
  
      fs.writeFileSync(mockDataPath, updatedContent);
      console.log(`${exportName} actualizado en mockData.js`);
  
      poolConnection.close();
    } catch (err) {
      console.error("Error al agregar datos de line chart:", err.message);
    }
  }
  agregarLineChartFlightFareData();

  async function agregarBarChartDistanceFareData(exportName = "barChartDistanceFareData") {
    try {
      const poolConnection = await sql.connect(config);
  
      const resultSet = await poolConnection.request().query(`
        WITH Distance_Info AS (
          SELECT 
            CASE
              WHEN CAST(nsmiles AS FLOAT) >= 0 AND CAST(nsmiles AS FLOAT) <= 1000 THEN '0-1000'
              WHEN CAST(nsmiles AS FLOAT) > 1000 AND CAST(nsmiles AS FLOAT) <= 2000 THEN '1001-2000'
              WHEN CAST(nsmiles AS FLOAT) > 2000 AND CAST(nsmiles AS FLOAT) <= 3000 THEN '2001-3000'
              WHEN CAST(nsmiles AS FLOAT) > 3000 AND CAST(nsmiles AS FLOAT) <= 4000 THEN '3001-4000'
              ELSE '4001+'
            END AS Distance_Range, fare 
          FROM Flights
        )
        SELECT AVG(CAST(fare AS FLOAT)) AS Average_Fare, Distance_Range, COUNT(*) AS Flights_per_distance
        FROM Distance_Info
        GROUP BY Distance_Range
        ORDER BY 
          CASE
            WHEN Distance_Range = '0-1000' THEN 1
            WHEN Distance_Range = '1001-2000' THEN 2
            WHEN Distance_Range = '2001-3000' THEN 3
            WHEN Distance_Range = '3001-4000' THEN 4
            WHEN Distance_Range = '4001+' THEN 5 
          END asc;
      `);
  
      const rows = resultSet.recordset;
  
      const processedData = rows.map(r => ({
        Distance_Range: r.Distance_Range,
        Average_Fare: parseFloat(r.Average_Fare),
        Flights_per_distance: parseInt(r.Flights_per_distance)
      }));
  
      // Leer mockData.js
      const mockDataPath = './src/data/mockData.js';
      const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');
  
      const exportRegex = new RegExp(`export const ${exportName} = (\\[.*?\\]);`, 's');
      const updatedContent = mockDataContent.includes(`export const ${exportName}`)
        ? mockDataContent.replace(exportRegex, `export const ${exportName} = ${JSON.stringify(processedData, null, 2)};`)
        : mockDataContent + `\nexport const ${exportName} = ${JSON.stringify(processedData, null, 2)};\n`;
  
      fs.writeFileSync(mockDataPath, updatedContent);
      console.log(`${exportName} actualizado en mockData.js`);
  
      poolConnection.close();
    } catch (err) {
      console.error("Error al agregar datos de bar chart:", err.message);
    }
  }
  
  agregarBarChartDistanceFareData();
  