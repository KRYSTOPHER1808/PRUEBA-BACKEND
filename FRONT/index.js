async function getDatos() {
    const res = await fetch("http://localhost:4000/productos"); // Esperamos a que la llamada fetch termine
    const resjson = await res.json(); // Convertimos la respuesta en JSON
    return resjson;
}

getDatos().then(datos => {
    console.log(datos); // Verificar qué se está recibiendo
    insertarDatosEnTabla(datos.recordset); // Accedemos a la propiedad 'recordset' que contiene el array de productos
}).catch(error => {
    console.error("Error al obtener los datos:", error); // Manejo de errores
});

function insertarDatosEnTabla(productos) {
    const tbody = document.getElementById("contido_tabla"); // Seleccionamos el tbody con el id "contido_tabla"
    tbody.innerHTML = ""; // Limpiamos el contenido anterior del tbody

    productos.forEach(producto => {
        const fila = document.createElement("tr"); // Creamos una nueva fila

        // Creamos las celdas para el ID, Nombre y Precio
        const celdaId = document.createElement("td");
        celdaId.textContent = producto.id; // ID del producto

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre; // Nombre del producto

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = `$${producto.precio.toFixed(2)}`; // Precio del producto con 2 decimales

        // Agregamos las celdas a la fila
        fila.appendChild(celdaId);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaPrecio);

        // Agregamos la fila al tbody
        tbody.appendChild(fila);
    });
}

document.getElementById("formAgregarProducto").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de la manera tradicional

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value.trim(); // Obtener el valor del campo 'nombre'
    const precio = parseFloat(document.getElementById("precio").value); // Obtener y convertir a número el campo 'precio'

    // Validar que el precio es un número válido
    if (isNaN(precio) || precio < 0) {
        alert("Por favor, ingresa un precio válido.");
        return;
    }

    // Crear un objeto con los datos del nuevo producto
    const nuevoProducto = {
        nombre: nombre,
        precio: precio
    };

    try {
        // Enviar los datos al backend utilizando fetch
        const respuesta = await fetch("http://localhost:4000/productosI", {
            method: "POST",
            body: JSON.stringify(nuevoProducto),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (respuesta.ok) {
            alert("Producto agregado con éxito");
            // Puedes limpiar el formulario después de agregar el producto
            document.getElementById("formAgregarProducto").reset();
            const datosActualizados = await getDatos();
            insertarDatosEnTabla(datosActualizados.recordset); 
        } else {
            const errorData = await respuesta.json();
            alert(`Error al agregar el producto: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        alert("Ocurrió un error al enviar la solicitud");
    }
});

document.getElementById("btnBuscar").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevenir que el formulario se envíe de la manera tradicional

    const nombre = document.getElementById("buscarProducto").value.trim(); // Obtener el valor del campo 'buscarProducto'


    try {
        // Hacer la solicitud POST
        const respuesta = await fetch("http://localhost:4000/productosB", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Establecer el tipo de contenido
            },
            body: JSON.stringify({ nombre }) // Enviar el nombre como cuerpo de la solicitud
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            insertarDatosEnTabla(datos.recordset); // Actualizar la tabla con los productos encontrados
        } else {
            alert(`Error al buscar el producto: ${datos.error}`);
        }
    } catch (error) {
        console.error("Error al buscar productos:", error);
        alert("Ocurrió un error al realizar la búsqueda");
    }
});


