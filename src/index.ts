import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/event';
import { Api } from './components/base/api';
import { ProductModel } from './components/models/ProductModal';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { ProductCard } from './components/views/ProductCard';
import { Modal } from './components/views/Modal';
import { CardViews } from './components/views/CardViews';
import { FormPayment } from './components/views/FormPayment';
import { ContactForm } from './components/views/ContactForm';
import { SuccessModal } from './components/views/SuccessModal';
import { PageView } from './components/views/PageView';
import { IProduct, BasketStatus, Order, FormPayments, ContactsForm } from './types';

const api = new Api(API_URL);
const eventEmitter = new EventEmitter();
const productModel = new ProductModel(api);
const cartModel = new CartModel();
const orderModel = new OrderModel(api);
const modal = new Modal();
const page = new PageView(eventEmitter); 

const cartView = new CardViews(eventEmitter, (product: IProduct) => {
    cartModel.removeFromCart(product.id);
});

const productCard = new ProductCard(
    document.querySelector('#card-catalog') as HTMLTemplateElement,
    (id: string) => {
        const product = productModel.getProductById(id);
        if (product) {
            modal.open(productCard.renderPreview(product));
            const buyButton = modal.getContent().querySelector('.card__button');
            buyButton?.addEventListener('click', () => {
                cartModel.addToCart(product);
                modal.close();
            });
        }
    }
);

// При загрузке списка товаров
productModel.on('products-updated', (products: IProduct[]) => {
    const cards = products.map(product => productCard.render(product));
    page.renderGallery(cards); 
});

// При изменении корзины
cartModel.on('cart-change', (state: BasketStatus) => {
    page.updateBasketCounter(state.items.length); 
    const basketContent = modal.getContent().querySelector('.basket');
    if (basketContent) {
        modal.open(cartView.render(state));
    }
});

// Открытие корзины
eventEmitter.on('cart:open', () => {
    modal.open(cartView.render(cartModel.getCartState()));
});

// Обработка оформления заказа
eventEmitter.on('order:submit', () => {
    const paymentForm = new FormPayment((paymentData: FormPayments) => {
        const contactForm = new ContactForm(async (contactData: ContactsForm) => {
            const orderData: Order = {
                ...paymentData,
                ...contactData,
                items: cartModel.getCartState().items.map(item => item.product.id),
                total: cartModel.getCartState().totalPrice
            };

            if (orderModel.validateOrder(orderData)) {
                try {
                    await orderModel.submitOrder(orderData);
                    cartModel.clearCart(); 
                    const successModal = new SuccessModal(() => {
                        modal.close();
                    });
                    modal.open(successModal.render(orderData.total));
                } catch (error) {
                    console.error('Ошибка при оформлении заказа:', error);
                }
            }
        });
        modal.open(contactForm.render());
    });
    modal.open(paymentForm.render());
});


productModel.fetchProducts();