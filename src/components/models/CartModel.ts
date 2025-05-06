// CartModel.ts
import { EventEmitter } from '../base/event';
import { IProduct, ProductCart, BasketStatus } from '../../types';

export class CartModel extends EventEmitter {
    private _items: ProductCart[] = [];

    constructor() {
        super();
    }

    addToCart(product: IProduct): void {
        const existing = this._items.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this._items.push({
                product: { ...product },
                quantity: 1
            });
        }
        this.emitChange();
    }

    removeFromCart(productId: string): void {
        this._items = this._items.filter(item => item.product.id !== productId);
        this.emitChange();
    }

    clearCart(): void {
        this._items = [];
        this.emitChange();
    }

    getCartState(): BasketStatus {
        return {
            items: this._items.map(item => ({
                product: { ...item.product },
                quantity: item.quantity
            })),
            totalPrice: this.calculateTotalPrice(),
            totalItems: this.getItemsCount()
        };
    }

    getItemsCount(): number {
        return this._items.reduce((sum, item) => sum + item.quantity, 0);
    }

    private calculateTotalPrice(): number {
        return this._items.reduce((sum, item) => 
            sum + (item.product.price || 0) * item.quantity, 0);
    }

    private emitChange(): void {
        this.emit('cart-change', this.getCartState());
    }
}