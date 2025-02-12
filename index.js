import productRoutes from "./src/routes/products.js";
import cartRoutes from "./src/routes/carts.js";
import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import ProductManager from './ProductManager.js';  // Nuestra clase para manejar productos

const app = express();
const PORT = 8080;

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  // Carpeta donde estarán las vistas

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Carpeta pública para archivos JS o CSS

// Inicializar ProductManager
const productManager = new ProductManager('./productos.json');

// Ruta para la vista principal (home)
app.get('/', async (req, res) => {
  const products = await productManager.getProducts();  // Obtenemos los productos del archivo JSON
  res.render('home', { products });  // Renderizamos la vista 'home' con los productos
});

// Ruta para la vista de productos en tiempo real (realTimeProducts)
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Iniciar el servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Inicializar el servidor WebSocket
const io = new Server(httpServer);

// Manejo de conexión con WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Enviar la lista actual de productos al cliente
  socket.emit('updateProducts', productManager.getProducts());

  // Escuchar evento para agregar un producto
  socket.on('newProduct', async (product) => {
    await productManager.addProduct(product);
    io.emit('updateProducts', await productManager.getProducts());
  });

  // Escuchar evento para eliminar un producto
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    io.emit('updateProducts', await productManager.getProducts());
  });
});