import express from "express";
import fs from "fs";
const router = express.Router();
const path = "./data/products.json";

// Leer datos del archivo
const readData = () => {
  if (!fs.existsSync(path)) return [];
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data || "[]");
};

// Escribir datos en el archivo
const writeData = (data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// POST / - Agregar un nuevo producto
router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios, excepto thumbnails." });
  }

  const products = readData();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  writeData(products);

  res.status(201).json({ message: "Producto agregado", product: newProduct });
});

// PUT /:pid - Actualizar un producto
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updateData = req.body;
  const products = readData();

  const productIndex = products.findIndex((product) => product.id === parseInt(pid));
  if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado" });

  const updatedProduct = { ...products[productIndex], ...updateData, id: products[productIndex].id };
  products[productIndex] = updatedProduct;
  writeData(products);

  res.json({ message: "Producto actualizado", product: updatedProduct });
});

// DELETE /:pid - Eliminar un producto
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const products = readData();

  const filteredProducts = products.filter((product) => product.id !== parseInt(pid));
  if (filteredProducts.length === products.length) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  writeData(filteredProducts);
  res.json({ message: "Producto eliminado" });
});


export default router;