import { Router } from "express";
import CartService from "../utils/cartService.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = await CartService.createCart();
        res.status(201).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear carrito" });
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartService.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener carrito" });
    }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        
        const updatedCart = await CartService.addProductToCart(cid, pid, quantity || 1);
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar producto" });
    }
});

// Eliminar un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const updatedCart = await CartService.removeProductFromCart(cid, pid);
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar producto del carrito" });
    }
});

// Vaciar un carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        
        const updatedCart = await CartService.clearCart(cid);
        if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al vaciar carrito" });
    }
});

export default router;