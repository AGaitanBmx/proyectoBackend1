const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = "./data/carts.json";

const readData = () => {
  if (!fs.existsSync(path)) return [];
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data || "[]");
};

const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// POST / - Crear un nuevo carrito
router.post("/", (req, res) => {
  const carts = readData();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1,
    products: [],
  };

  carts.push(newCart);
  writeData(carts);

  res.status(201).json({ message: "Carrito creado", cart: newCart });
});

// GET /:cid - Listar productos de un carrito
router.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const carts = readData();

  const cart = carts.find((cart) => cart.id === parseInt(cid));
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  res.json({ products: cart.products });
});

// POST /:cid/product/:pid - Agregar producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const carts = readData();

  const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cid));
  if (cartIndex === -1) return res.status(404).json({ error: "Carrito no encontrado" });

  const productIndex = carts[cartIndex].products.findIndex((p) => p.product === parseInt(pid));
  if (productIndex !== -1) {
    carts[cartIndex].products[productIndex].quantity += 1;
  } else {
    carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 });
  }

  writeData(carts);
  res.json({ message: "Producto agregado al carrito", cart: carts[cartIndex] });
});

module.exports = router;