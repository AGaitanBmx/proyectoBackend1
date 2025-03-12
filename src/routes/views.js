import express from 'express';
import ProductService from '../utils/ProductService.js';
import CartService from '../utils/cartService.js'; // Asegúrate de tener esto implementado

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        let filter = {};
        if (category) filter.category = category;
        
        let sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        if (sort === 'desc') sortOption.price = -1;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption
        };
        
        const products = await ProductService.getProducts(filter, options);
        
        res.render('product', { products: products.docs, pagination: products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/cart', async (req, res) => {
    try {
        const cart = await CartService.getCart(); // Suponiendo que tengas una función para obtener el carrito
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

export default router;