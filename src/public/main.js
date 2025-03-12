const socket = io(); 

// Escuchar la lista de productos actualizada
socket.on('updateProducts', (products) => {
  console.log("📦 Productos recibidos en cliente:", JSON.stringify(products, null, 2));

  if (!products || !products.docs || products.docs.length === 0) {
      console.warn("⚠️ Se recibió un array vacío o sin 'docs'. No se actualizará la lista.");
      return;
  }

  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // Limpia la lista antes de agregar productos

  products.docs.forEach((product) => {  // 👈 Usamos products.docs
      const li = document.createElement("li");
      li.innerHTML = `<strong>${product.title}</strong> - $${product.price}
                      <button class="delete-btn" data-id="${product._id}">Eliminar</button>`;
      productList.appendChild(li);
  });

  // Agregar eventos a los botones de eliminar
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      socket.emit('deleteProduct', id); // Usamos _id en lugar de id normal
    });
  });
});

// Enviar un nuevo producto al servidor
document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const stock = parseInt(document.getElementById('stock').value);
  const thumbnail = document.getElementById('thumbnail').value || 'https://via.placeholder.com/150'; // Imagen por defecto

  if (!title || !description || !price || !category || !stock) {
    alert('Todos los campos son obligatorios');
    return;
  }

  socket.emit('newProduct', { title, description, price, category, stock, thumbnail });

  // Limpiar formulario
  e.target.reset();
});
