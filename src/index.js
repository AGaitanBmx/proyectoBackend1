import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils/dirname.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import ProductService from './utils/ProductService.js';
import connectDB from './config/db.js';
import viewsRouter from './routes/views.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

connectDB();

const hbs = handlebars.create({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
    const products = await ProductService.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await ProductService.getProducts();
    res.render('realTimeProducts', { products });
});

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado');

    socket.emit('updateProducts', await ProductService.getProducts());

    socket.on('newProduct', async product => {
        await ProductService.addProduct(product);
        io.emit('updateProducts', await ProductService.getProducts());
    });

    socket.on('deleteProduct', async id => {
        await ProductService.deleteProduct(id);
        io.emit('updateProducts', await ProductService.getProducts());
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
