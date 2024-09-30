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
        // Celda de acciones (Borrar, Editar)
        const celdaAcciones = document.createElement("td");
        celdaAcciones.classList.add("celda-acciones");
        // Botón para editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-editar");
        btnEditar.addEventListener("click", () => editarProducto(producto.id)); // Asigna la función para editar
        celdaAcciones.appendChild(btnEditar);

        // Botón para borrar
        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Borrar";
        btnBorrar.classList.add("btn-borrar");
        btnBorrar.addEventListener("click", () => borrarProducto(producto.id)); // Asigna la función para borrar
        celdaAcciones.appendChild(btnBorrar);        
        
        // Agregamos las celdas a la fila
        fila.appendChild(celdaId);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaAcciones); 

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

// Función para borrar un producto
async function borrarProducto(id) {
    try {
        const respuesta = await fetch(`http://localhost:4000/productosBr/${id}`, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Producto borrado con éxito.");
            const datosActualizados = await getDatos();
            insertarDatosEnTabla(datosActualizados.recordset);
        } else {
            alert("Error al borrar el producto.");
        }
    } catch (error) {
        console.error("Error al borrar el producto:", error);
        alert("Ocurrió un error al borrar el producto.");
    }
}

// Función para editar un producto
async function editarProducto(id) {
    const nuevoNombre = prompt("Introduce el nuevo nombre del producto:");
    const nuevoPrecio = prompt("Introduce el nuevo precio del producto:");

    if (nuevoNombre && nuevoPrecio) {
        const productoEditado = {
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio)
        };

        try {
            // Realizamos la solicitud para editar el producto
            const respuesta = await fetch(`http://localhost:4000/productosE/${id}`, {
                method: "PUT",
                body: JSON.stringify(productoEditado),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const datos = await respuesta.json(); // Asegúrate de esperar la conversión a JSON

            if (respuesta.ok) {
                alert("Producto editado con éxito");
                const datosActualizados = await getDatos();
                insertarDatosEnTabla(datosActualizados.recordset); 
            } else {
                // Aquí manejamos el error
                alert(`Error al editar el producto: ${datos.error}`);
            }
        } catch (error) {
            console.error("Error al editar el producto:", error);
            alert("Ocurrió un error al editar el producto.");
        }
    } else {
        alert("Nombre o precio no válidos.");
    }
}



