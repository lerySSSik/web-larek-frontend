import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class ProductCard {
    constructor(
        private template: HTMLTemplateElement,
        private onClick: (productId: string) => void
    ) {}

    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'другое': 'card__category_other',

            'soft-skill': 'card__category_soft',
            'hard-skill': 'card__category_hard',
            'additional': 'card__category_additional',
            'button': 'card__category_button',
            'other': 'card__category_other'
        };

        return categoryMap[category.toLowerCase()] || 'card__category_other';
    }

    private setElementText(element: Element | null, text: string): void {
        if (element) {
            element.textContent = text;
        }
    }

    private setImage(element: HTMLImageElement | null, src: string, alt: string): void {
        if (element) {
            element.src = src.startsWith('http') ? src : `${CDN_URL}${src}`;
            element.alt = alt;
        }
    }

    render(product: IProduct): HTMLElement {
        const card = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        
        // Устанавливаем базовые свойства
        this.setElementText(card.querySelector('.card__title'), product.title || 'Без названия');
        this.setElementText(card.querySelector('.card__price'), 
            product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setImage(card.querySelector('.card__image'), product.image, product.title || '');

        // Обработка категории
        const categoryElement = card.querySelector('.card__category');
        if (categoryElement) {
            this.setElementText(categoryElement, product.category);
            categoryElement.className = 'card__category'; // Сбрасываем классы
            categoryElement.classList.add(this.getCategoryClass(product.category));
        }

        // Обработчик клика
        card.addEventListener('click', () => {
            this.onClick(product.id);
        });

        return card;
    }

    renderPreview(product: IProduct): HTMLElement {
        const template = document.querySelector('#card-preview') as HTMLTemplateElement;
        const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        // Устанавливаем базовые свойства
        const productName = product.title || 'Без названия';
        this.setElementText(card.querySelector('.card__title'), productName);
        this.setElementText(card.querySelector('.card__text'), product.description || '');
        this.setElementText(card.querySelector('.card__price'), 
            product.price ? `${product.price} синапсов` : 'Бесценно');
        this.setImage(card.querySelector('.card__image'), product.image, productName);

        // Обработка категории
        const categoryElement = card.querySelector('.card__category');
        if (categoryElement) {
            this.setElementText(categoryElement, product.category);
            categoryElement.className = 'card__category'; // Сбрасываем классы
            categoryElement.classList.add(this.getCategoryClass(product.category));
        }

        // Удаляем кнопку для бесценных товаров
        if (product.price === null) {
            const buyButton = card.querySelector('.card__button');
            buyButton?.remove();
        }

        return card;
    }
}