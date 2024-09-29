const sql =require('mssql');
const dotenv=require("dotenv");
dotenv.config();
const dbSettings=sql.connect({
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    options: {
        encript:false,
        trustServerCertificate: true
    }
})

async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}
module.exports={
    getConnection
}