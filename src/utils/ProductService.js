import Product from '../models/product.model.js';

class ProductService {
    async getProducts(query = {}, { page = 1, limit = 10, sort = {} } = {}) {
        try {
            console.log("🔎 Buscando productos con filtro:", query);
            console.log("📜 Opciones:", { page, limit, sort });
    
            const skip = (page - 1) * limit;
    
            const products = await Product.find(query)
                .limit(limit)  // ✅ Usa directamente el parámetro `limit`
                .skip(skip)    // ✅ Usa `skip` calculado arriba
                .sort(sort)    // ✅ Usa `sort` directamente
                .lean();       // 👈 Convierte a objetos simples
    
            const total = await Product.countDocuments(query);
    
            return {
                docs: products,
                totalDocs: total,
                totalPages: Math.ceil(total / limit),
                page: Number(page),
                limit: Number(limit)
            };
        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
            throw error;
        }
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