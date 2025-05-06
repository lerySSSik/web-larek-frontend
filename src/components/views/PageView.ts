import { IProduct } from '../../types';
// PageView.ts
import { EventEmitter } from '../base/event';

export class PageView {
    private readonly gallery: HTMLElement;
    private readonly basketCounter: HTMLElement;

    constructor(private eventEmitter: EventEmitter) {
        this.gallery = document.querySelector('.gallery') as HTMLElement;
        const basketButton = document.querySelector('.header__basket') as HTMLElement;
        this.basketCounter = basketButton.querySelector('.header__basket-counter') as HTMLElement;
        
        basketButton.addEventListener('click', () => {
            this.eventEmitter.emit('cart:open');
        });

        this.updateBasketCounter(0);
    }

    // Добавляем отсутствующий метод
    renderGallery(items: HTMLElement[]): void {
        this.gallery.replaceChildren(...items);
    }

    updateBasketCounter(count: number): void {
        this.basketCounter.textContent = count.toString();
        this.basketCounter.style.display = count > 0 ? 'flex' : 'none';
    }
}