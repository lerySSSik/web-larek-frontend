import { EventEmitter } from '../base/event';
import { IProduct, ApiList } from '../../types';
import { Api } from '../base/api';

export class ProductModel extends EventEmitter {
  private products: IProduct[] = [];
  private api: Api;

  constructor(api: Api) {
    super();
    this.api = api;
  }

  async fetchProducts(): Promise<void> {
	try {
		console.log('[DEBUG] Fetching products...');
		const response = await this.api.get<ApiList<any>>('product'); 
		console.log('[DEBUG] Received:', response);
      this.products = response.items.map(item => ({
        id: item.id,
        title: item.title || item.name,
        price: item.price,
        category: item.category,
        image: item.image || item.preview,
        description: item.description
      }));

      console.log('Processed products:', this.products);
      this.emit('products-updated', this.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      this.emit('products-error', error);
    }
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  getAllProducts(): IProduct[] {
    return [...this.products]; 
  }
}