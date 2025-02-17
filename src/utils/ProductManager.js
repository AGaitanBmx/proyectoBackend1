import fs from 'fs';
import path from 'path';
import { __dirname } from './dirname.js';
export default class ProductManager {
  constructor(filename) {
    this.filePath = path.join(__dirname, '..', 'data', filename);
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    products.push(product);
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter(product => product.id !== id);
    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }
}