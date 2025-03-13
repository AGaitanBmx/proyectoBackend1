const socket = io();

// Escuchar la lista de productos actualizada
socket.on('updateProducts', (products) => {
    console.log("📦 Productos recibidos en cliente:", JSON.stringify(products, null, 2));

    if (!products || !products.docs || products.docs.length === 0) {
        console.warn("⚠️ Se recibió un array vacío o sin 'docs'. No se actualizará la lista.");
        return;
    }

    const productList = document.getElementById("productList");
    const receivedProducts = products.docs;

    console.log("  - productList.children.length:", productList.children.length);
    const existingProductsMap = new Map();
    productList.querySelectorAll('li').forEach(li => {
        const id = li.dataset.id;
        if (id) { // Verificar si el elemento tiene data-id
            existingProductsMap.set(id, li);
        }
    });
    console.log("  - existingProductsMap.size:", existingProductsMap.size);

    receivedProducts.forEach(product => {
        const existingLi = existingProductsMap.get(product._id);
        if (existingLi) {
            // Actualizar producto existente
            existingLi.innerHTML = `
                <img src="${product.thumbnail}" alt="Imagen de ${product.title}" style="width: 100px; height: auto;">
                <strong>${product.title}</strong> - $${product.price}
                <button class="delete-btn" data-id="${product._id}">Eliminar</button>
                <button class="add-to-cart-btn" data-id="${product._id}">Agregar al Carrito</button>
            `;
        } else {
            // Agregar nuevo producto
            const li = document.createElement("li");
            li.dataset.id = product._id;
            li.innerHTML = `
                <img src="${product.thumbnail}" alt="Imagen de ${product.title}" style="width: 100px; height: auto;">
                <strong>${product.title}</strong> - $${product.price}
                <button class="delete-btn" data-id="${product._id}">Eliminar</button>
                <button class="add-to-cart-btn" data-id="${product._id}">Agregar al Carrito</button>
            `;
            productList.appendChild(li);
        }
        existingProductsMap.delete(product._id);
    });

    console.log("  - existingProductsMap.size (after processing):", existingProductsMap.size);

    existingProductsMap.forEach(li => li.remove());

    console.log("  - productList.children.length (after cleanup):", productList.children.length);

    // Agregar eventos a los botones de eliminar y agregar al carrito
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            socket.emit('deleteProduct', id);
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            // Aquí puedes agregar la lógica para agregar el producto al carrito
            console.log(`Producto con ID ${id} agregado al carrito.`);
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