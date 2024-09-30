// Función para abrir la modal
var modal = document.getElementById("myModal");
var modalBody = document.getElementById("modalBody");
var span = document.getElementById("closeModal");

// Función para mostrar la modal de confirmación de borrado
function mostrarModalBorrado(producto) {
    // Cargar el contenido HTML de la modal
    fetch('./FRONT/confirmarBorrado.html')
        .then(response => response.text())
        .then(html => {
            // Inyectar el HTML de la modal en el contenedor
            modalBody.innerHTML = html;
            var datosProducto = document.getElementById("datosProducto");
            // Mostrar datos del producto en la modal
            datosProducto.textContent = `ID: ${producto.id}, Nombre: ${producto.nombre}, Precio: $${producto.precio.toFixed(2)}`;

            // Mostrar la modal
            modal.style.display = "block";

            // Manejo del botón Aceptar
            document.getElementById("btnAceptarBorrar").addEventListener("click", function() {
                borrarProducto(producto.id); // Llamar a la función para borrar
                cerrarModal(); // Cerrar la modal después de borrar el producto
            });

            // Manejo del botón Cancelar
            document.getElementById("btnCancelarBorrar").addEventListener("click", cerrarModal);

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

// Función para borrar el producto (implementación en index.js)
