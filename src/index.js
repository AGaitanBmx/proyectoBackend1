import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils/dirname.js'; // Importa __dirname correctamente
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import ProductManager from './utils/ProductManager.js';

const app = express();
const server = createServer(app); // Usamos createServer para Socket.io
const io = new Server(server);

const hbs = handlebars.create({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productManager = new ProductManager('./productos.json');

app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    // Emitir productos iniciales
    socket.emit('updateProducts', await productManager.getProducts());

    socket.on('newProduct', async product => {
        await productManager.addProduct(product);
        io.emit('updateProducts', await productManager.getProducts()); // Emitir a todos los clientes
    });

    socket.on('deleteProduct', async id => {
        await productManager.deleteProduct(id);
        io.emit('updateProducts', await productManager.getProducts()); // Emitir a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;
server.listen(PORT, () => { // Usamos server.listen()
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});