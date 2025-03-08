import Product from '../models/product.model.js';

class ProductService {
    async getProducts(query = {}, options = {}) {
        console.log("🔎 Buscando productos con filtro:", query);
        console.log("📜 Opciones:", options);
        
        const products = await Product.find(query).limit(options.limit).skip(options.skip).sort(options.sort);
    
        console.log("📦 Productos encontrados:", products);
        return products;
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async addProduct(data) {
        const newProduct = new Product(data);
        return await newProduct.save();
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async updateProduct(id, newData) {
        return await Product.findByIdAndUpdate(id, newData, { new: true });
    }

    async countProducts(query = {}) {
      return await Product.countDocuments(query);
  }
}

export default new ProductService();