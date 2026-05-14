const $ = (selector) => document.querySelector(selector)

const categoriasListado = $(".categorias")

// Función para actualizar el badge del navbar
const actualizarContador = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = $("#cart-count");
    if (contador) {
        contador.textContent = carrito.length;
        // Ocultar si está vacío, mostrar si tiene productos
        contador.classList.toggle("hidden", carrito.length === 0);
    }
};

// Inicializar contador al cargar la página
actualizarContador();

// Función para abrir el Modal del Carrito
const abrirModalCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let htmlLista = '<div class="text-left space-y-3 max-h-60 overflow-y-auto pr-2">';

    if (carrito.length === 0) {
        htmlLista += '<p class="text-gray-500 italic text-center py-4">Tu carrito está vacío.</p>';
    } else {
        let total = 0;
        carrito.forEach((item, index) => {
            total += parseInt(item.precio);
            htmlLista += `
                <div class="flex justify-between items-center border-b pb-2 border-gray-100">
                    <div class="flex-1">
                        <p class="font-bold text-sm text-gray-800">${item.nombre}</p>
                        <p class="text-xs text-[#4263B2]">${parseInt(item.precio).toLocaleString()} GS.</p>
                    </div>
                    <button onclick="window.eliminarYRefrescarModal(${index})" class="ml-4 text-gray-400 hover:text-red-500 transition-colors" title="Quitar del carrito">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>`;
        });
        htmlLista += `
            <div class="pt-3 flex justify-between items-center font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span class="text-[#4263B2]">${total.toLocaleString()} GS.</span>
            </div>`;
    }
    htmlLista += '</div>';

    Swal.fire({
        title: '<span class="font-space">Mi Selección</span>',
        html: htmlLista,
        showCloseButton: true,
        showConfirmButton: carrito.length > 0,
        confirmButtonText: 'Finalizar Pedido',
        confirmButtonColor: '#4263B2',
        showCancelButton: carrito.length > 0,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#94a3b8'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'carrito.html';
        }
    });
};

if (categoriasListado) {
    categoriasListado.addEventListener("click", function (evento) {
        const producto = evento.target.closest("[data-precio]");

        if (producto) {
            evento.preventDefault();
            Swal.fire({
                title: producto.dataset.producto,
                text: "Ver más detalles",
                icon: "info",
                confirmButtonColor: "#4263B2",
                confirmButtonText: "Ver detalles del producto"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = producto.href;
                }
            });
        }
    });
}

// Lógica para los botones "Añadir al carrito" en las páginas de producto
const btnAgregarDetalle = $(".btn-agregar");
if (btnAgregarDetalle) {
    btnAgregarDetalle.addEventListener("click", () => {
        const item = { nombre: btnAgregarDetalle.dataset.producto, precio: btnAgregarDetalle.dataset.precio };
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(item);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        Swal.fire({ title: "¡Añadido!", text: `${item.nombre} se agregó al carrito`, icon: "success", confirmButtonColor: "#4263B2" });
    });
}

// Lógica para la página carrito.html
const listaCarrito = $("#lista-carrito");
const totalCarrito = $("#total-carrito");

const renderizarCarrito = () => {
    if (!listaCarrito) return;
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    listaCarrito.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="text-gray-500 italic py-10 text-center">Tu carrito está vacío.</p>';
        if (totalCarrito) totalCarrito.textContent = "0 GS.";
        return;
    }

    carrito.forEach((item, index) => {
        total += parseInt(item.precio);
        listaCarrito.innerHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-6 rounded-sm border border-gray-100">
                <div class="flex flex-col">
                    <span class="text-[10px] font-bold text-[#4263B2] uppercase tracking-wider">Producto</span>
                    <h3 class="text-lg font-bold text-gray-900">${item.nombre}</h3>
                    <p class="text-sm text-gray-500">${parseInt(item.precio).toLocaleString()} GS.</p>
                </div>
                <button onclick="window.eliminarDelCarrito(${index})" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
        `;
    });

    if (totalCarrito) totalCarrito.textContent = total.toLocaleString() + " GS.";
};

// Exponer función de borrado al objeto global (necesario por ser type="module")
window.eliminarDelCarrito = (index) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
};

const btnVaciar = $("#vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        renderizarCarrito();
        actualizarContador();
    });
}


const btnFinalizar = $("#finalizar-compra");
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        Swal.fire({
            title: "¡Compra exitosa!",
            text: "Gracias por confiar en CELLPOINT. Te redirigiremos al catálogo.",
            icon: "success",
            confirmButtonColor: "#4263B2"
        }).then(() => {
            localStorage.removeItem("carrito"); 
            window.location.href = "catalogo.html"; 
        });
    });
}

// Vincular el icono del carrito en el Navbar para abrir el modal
const cartBtnNavbar = document.querySelector('[aria-label="Carrito"]');
if (cartBtnNavbar) {
    cartBtnNavbar.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModalCarrito();
    });
}

// Función global para eliminar desde el modal y refrescar la vista
window.eliminarYRefrescarModal = (index) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    abrirModalCarrito(); // Reabre el modal actualizado
};

// Lógica para las tarjetas de series en index.html
const gridSeries = $(".grid-series");
if (gridSeries) {
    gridSeries.addEventListener("click", (e) => {
        const link = e.target.closest("[data-serie]");
        if (link) {
            e.preventDefault();
            const serie = link.dataset.serie;
            let titulo, descripcion;

            if (serie === "S") {
                titulo = "Serie Galaxy S";
                descripcion = "Épica de principio a fin. Descubre la potencia de la Inteligencia Artificial con la Serie S, diseñada para capturar fotos nocturnas increíbles y ofrecer un rendimiento sin precedentes.";
            } else if (serie === "Z") {
                titulo = "Serie Galaxy Z";
                descripcion = "Pliégalo todo. La innovación plegable que redefine lo que un smartphone puede hacer. Desde la multitarea del Fold hasta el estilo compacto del Flip.";
            } else if (serie === "A") {
                titulo = "Serie Galaxy A";
                descripcion = "Genial para todos. Pantallas asombrosas, cámaras versátiles y baterías de larga duración. Todo lo que necesitas en un diseño que amas.";
            }

            Swal.fire({
                title: `<span class="font-space font-bold text-2xl">${titulo}</span>`,
                text: descripcion,
                confirmButtonColor: "#4263B2",
                confirmButtonText: "Ver Catálogo",
                showCancelButton: true,
                cancelButtonText: "Cerrar",
                cancelButtonColor: "#94a3b8"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "catalogo.html";
                }
            });
        }
    });
}

renderizarCarrito();