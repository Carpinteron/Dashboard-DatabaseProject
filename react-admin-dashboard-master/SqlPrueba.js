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
agregarinfo('mockTransactions'); 


