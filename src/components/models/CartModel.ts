import { EventEmitter } from '../base/event';
import { IProduct, ProductCart, BasketStatus } from '../../types';

export class CartModel extends EventEmitter {
    private _items: ProductCart[] = [];

    constructor() {
        super();
        this.emitChange();
    }

    // Добавляет товар в корзину или увеличивает количество
    addToCart(product: IProduct): void {
        if (!this.isProductValid(product)) {
            console.warn('Cannot add invalid product to cart', product);
            return;
        }

        const existingItem = this.findCartItem(product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this._items.push({
                product: { ...product }, 
                quantity: 1
            });
        }
        
        this.emitChange();
    }

    // Удаляет товар из корзины
    removeFromCart(productId: string): void {
        this._items = this._items.filter(item => item.product.id !== productId);
        this.emitChange();
    }

    // Очистка корзины
    clearCart(): void {
        if (this._items.length === 0) return;
        this._items = [];
        this.emitChange();
    }

    // Возвращает текущее состояние корзины
    getCartState(): BasketStatus {
        return {
            items: this.getItemsCopy(),
            totalPrice: this.calculateTotalPrice(),
            totalItems: this.calculateTotalItems()
        };
    }

    // Проверяет валидность товара для добавления в корзину
    private isProductValid(product: IProduct): boolean {
        return product.price !== null && product.price !== undefined;
    }

    // Находит товар по ID
    private findCartItem(productId: string): ProductCart | undefined {
        return this._items.find(item => item.product.id === productId);
    }

    // Создает защищенную копию списка товаров
    private getItemsCopy(): ProductCart[] {
        return this._items.map(item => ({
            ...item,
            product: { ...item.product } 
        }));
    }

    // Вычисляет общую стоимость
    private calculateTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.product.price || 0) * item.quantity;
        }, 0);
    }

    // Общее ко-во товаров
    private calculateTotalItems(): number {
        return this._items.reduce((total, item) => total + item.quantity, 0);
    }

    // Уведомляет об изменениях
    private emitChange(): void {
        this.emit('cart-change', this.getCartState());
    }
}