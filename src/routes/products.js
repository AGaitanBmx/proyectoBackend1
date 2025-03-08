import { Router } from 'express';
import ProductService from '../utils/ProductService.js';
import Product from '../models/product.model.js';

const router = Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        console.log("🔎 Recibiendo petición GET con:", { limit, page, sort, query });

        let filter = {};
        if (query) {
            filter = { 
                $or: [
                    { category: query }, 
                    { status: query === "available" ? true : false }
                ]
            };
        }

        let sortOption = {};
        if (sort === "asc") sortOption = { price: 1 };
        if (sort === "desc") sortOption = { price: -1 };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption
        };

        console.log("🔧 Filtro aplicado:", filter);
        console.log("🔧 Opciones de paginación:", options);

        const products = await Product.paginate(filter, options);

        console.log("📦 Productos encontrados:", products);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });

    } catch (error) {
        console.error("❌ Error en el GET de productos:", error);
        res.status(500).json({ status: "error", message: "Error al obtener productos" });
    }
});
// Obtener un solo producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await ProductService.addProduct(req.body);
        res.status(201).json({ message: 'Producto agregado', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await ProductService.deleteProduct(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;