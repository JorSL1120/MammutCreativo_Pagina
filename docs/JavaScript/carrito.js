document.addEventListener("DOMContentLoaded", function () {
  let carrito = [];

  function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarritoDesdeLocalStorage() {
    const guardado = localStorage.getItem('carrito');
    carrito = guardado ? JSON.parse(guardado) : [];
  }

  function actualizarCarrito() {
    const lista = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    const count = document.getElementById('cart-count');

    if (!lista || !total || !count) return; // Evita errores si la página no tiene estos elementos

    lista.innerHTML = '';
    let totalPrecio = 0;
    let totalCantidad = 0;

    carrito.forEach(p => {
      totalPrecio += p.precio * p.cantidad;
      totalCantidad += p.cantidad;
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `${p.nombre} x ${p.cantidad} <span>$${p.precio * p.cantidad} MXN</span>`;
      lista.appendChild(li);
    });

    total.textContent = totalPrecio;
    count.textContent = totalCantidad;
  }

  function finalizarCompra() {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    let resumen = 'Gracias por tu compra. Este es el resumen:\n\n';
    carrito.forEach(p => {
      resumen += `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad} MXN\n`;
    });

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    resumen += `\nTOTAL: $${total} MXN`;

    alert(resumen);
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarrito();

    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modal) modal.hide();
  }

  // Hace accesible la función desde HTML
  window.finalizarCompra = finalizarCompra;

  // Inicializa
  cargarCarritoDesdeLocalStorage();
  actualizarCarrito();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.dataset.id;
      const nombre = this.dataset.nombre;
      const precio = parseInt(this.dataset.precio);

      const productoExistente = carrito.find(p => p.id === id);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
      }

      guardarCarritoEnLocalStorage();
      actualizarCarrito();
    });
  });
});
