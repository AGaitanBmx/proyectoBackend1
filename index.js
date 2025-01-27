const express = require("express");
const app = express();
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});