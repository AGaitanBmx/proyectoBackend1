const socket = io();

// Escuchar la lista de productos actualizada
socket.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  products.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = `${product.title} - ${product.price} USD`;
    productList.appendChild(li);
  });
});

// Enviar un nuevo producto al servidor
document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;

  socket.emit('newProduct', { title, price });

  // Limpiar formulario
  document.getElementById('title').value = '';
  document.getElementById('price').value = '';
});