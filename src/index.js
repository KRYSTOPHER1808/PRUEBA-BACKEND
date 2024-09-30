const express=require("express");
const morgan=require("morgan");
const database =require("./database.js");
const cors=require("cors");
const sql = require('mssql'); // Importar sql aquí
//config inicial
const app=express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("puerto  "+ app.get("port"));
//middlewars
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin:["http://127.0.0.1:5501","http://127.0.0.1:5500"]
}))
//rutas
app.get("/productos",async (req,res)=>{
    const conexion =await database.getConnection();
    const resulatdo = await conexion.query("select * from productos");
    res.json(resulatdo);
});
// Ruta para ingresar un nuevo producto
app.post("/productosI", async (req, res) => {
    const { nombre, precio } = req.body;

    // Validación de los campos obligatorios
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio y debe ser un texto." });
    }

    try {
        // Obtener la conexión a la base de datos
        const pool = await database.getConnection(); // Cambiar `conexion` a `pool`

        // Consulta SQL para insertar el nuevo producto
        const query = `INSERT INTO productos (nombre, precio) VALUES (@nombre, @precio)`;

        // Ejecutar la consulta con los parámetros
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('precio', sql.Decimal(10, 2), precio || null)
            .query(query);
        console.log(result);
        // Enviar una respuesta exitosa
        res.status(201).json({ message: "Producto agregado exitosamente." });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ error: "Error al agregar producto: " + error.message });
    }
});

// Ruta para buscar productos por nombre
// Ruta para buscar productos por nombre usando POST
app.post("/productosB", async (req, res) => {
    const { nombre } = req.body; // Obtener el nombre desde el cuerpo de la solicitud
    try {
        const conexion = await database.getConnection();
        
        // Consulta SQL para buscar productos por nombre
        const query = `SELECT * FROM productos WHERE nombre LIKE '%' + @nombre +'%' `;
        const result = await conexion.request()
            .input('nombre', sql.VarChar, nombre) // Utiliza LIKE para buscar coincidencias
            .query(query);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar productos: " + error.message });
    }
});
// Ruta para borrar un producto por su ID
app.delete("/productosBr/:id", async (req, res) => {
    const { id } = req.params; // El ID del producto se pasará como parámetro en la URL

    try {
        const pool = await database.getConnection();

        // Consulta SQL para borrar el producto por ID
        const query = `DELETE FROM productos WHERE id = @id`;

        // Ejecutar la consulta con el parámetro ID
        const result = await pool.request()
            .input('id', sql.Int, id) // El ID es un entero
            .query(query);

        if (result.rowsAffected[0] > 0) {
            res.json({ message: "Producto eliminado exitosamente." });
        } else {
            res.status(404).json({ error: "Producto no encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto: " + error.message });
    }
});
// Ruta para editar un producto por su ID
app.put("/productosE/:id", async (req, res) => {
    const { id } = req.params; // El ID del producto a editar se pasa como parámetro en la URL
    const { nombre, precio } = req.body; // Los nuevos valores que quieres actualizar

    // Validación de los campos obligatorios
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio y debe ser un texto." });
    }

    try {
        const pool = await database.getConnection();

        // Consulta SQL para actualizar el producto
        const query = `UPDATE productos SET nombre = @nombre, precio = @precio WHERE id = @id`;

        // Ejecutar la consulta con los parámetros
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('precio', sql.Decimal(10, 2), precio)
            .query(query);

        if (result.rowsAffected[0] > 0) {
            //res.json({ message: "Producto actualizado exitosamente." });
            res.json(result);
        } else {
            res.status(404).json({ error: "Producto no encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto: " + error.message });
    }
});








