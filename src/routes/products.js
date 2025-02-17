import { Router } from 'express';
import ProductManager from '../utils/ProductManager.js';

const router = Router();
const productManager = new ProductManager('products.json'); 


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});


router.get('/:pid', async (req, res) => {
    const product = (await productManager.getProducts()).find(p => p.id == req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});


router.post('/', async (req, res) => {
    await productManager.addProduct(req.body);
    res.status(201).json({ message: 'Producto agregado' });
});


router.delete('/:pid', async (req, res) => {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.json({ message: 'Producto eliminado' });
});

export default router;