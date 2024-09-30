// Función para abrir la modal
var modal = document.getElementById("myModalE");
var modalBody = document.getElementById("modalBodyE");
var span = document.getElementById("closeModalE");

// Función para mostrar la modal de confirmación de borrado
function mostrarModalEditar(producto) {
    // Cargar el contenido HTML de la modal
    fetch('./FRONT/modalEditar.html')
        .then(response => response.text())
        .then(html => {
            // Inyectar el HTML de la modal en el contenedor
            modalBody.innerHTML = html;
            var datosProducto = document.getElementById("datosProducto");
            // Mostrar datos del producto en la modal
            datosProducto.textContent = `ID: ${producto.id}`;

            // Mostrar la modal
            modal.style.display = "block";
            document.getElementById("nombreE").value=producto.nombre;
            document.getElementById("precioE").value=producto.precio;

            // Manejo del botón Aceptar
            document.getElementById("btnAceptarEditar").addEventListener("click", function() {
                            //ingresar nuevo datos
                const nuevoNombre = document.getElementById("nombreE").value.trim(); // Obtener el valor del campo 'nombre'
                const nuevoPrecio = parseFloat(document.getElementById("precioE").value); // Obtener y convertir a número el campo 'precio'
                const productoEditado = {
                    id:producto.id,
                    nombre: nuevoNombre,
                    precio: parseFloat(nuevoPrecio)
                };

                // Validar que el precio es un número válido
                if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
                    alert("Por favor, ingresa un precio válido.");
                    return;
                }
                editarProducto(productoEditado); // Llamar a la función para borrar
                cerrarModal(); // Cerrar la modal después de borrar el producto
            });

            // Manejo del botón Cancelar
            document.getElementById("btnCancelarEditar").addEventListener("click", cerrarModal);

            // Manejo del botón para cerrar la modal (la "X")
            span.addEventListener("click", cerrarModal);
        })
        .catch(error => {
            console.error("Error al cargar la modal:", error);
        });
}

// Función para cerrar la modal
function cerrarModal() {
    modal.style.display = "none"; // Ocultar la modal
    modalBody.innerHTML = ''; // Limpiar el contenido del contenedor de la modal
}