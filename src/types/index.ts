// Тип данных для одного товара
export interface IProduct {
  id: string;                   //Уникальный идентификатор товара
  title: string;                //Название товара 
  price: number;                // Название товара (внутреннее использование)
  description: string;          // Цена товара (может быть null, если товар бесценен)
  category: string;             // Категория 
  image: string;                // Ссылка на изображение
}

  // Типизированный ответ от API со списком товаров
  export type ApiList<T> = {
    total: number;                 // Общее количество товаров на сервере
    items: T[];                    // Массив объектов типа T
  };
  
  // Один товар в корзине
  export interface ProductCart {
    product: IProduct;             // Экземпляр товара
    quantity: number;              // Количество этого товара в корзине
  }
  
  // Состояние корзины целиком
  export interface BasketStatus {
    items: ProductCart[];             // Массив всех товаров в корзине
    totalPrice: number;  
    totalItems: number;          // Общая сумма заказа
  }
  
  // Данные, которые передаются при оформлении заказа
  export interface Order {
    address: string;               // Адрес доставки
    payment: string;               // Способ оплаты (напр. 'card', 'cash')
    email: string;                 // Email покупателя
    phone: string;                 // Телефон покупателя
    items: string[];               // Массив ID товаров
    total: number;                 // Общая сумма заказа
  }
  
  // Интерфейс для данных формы оплаты
  export interface FormPayments {
    payment: string;               // Способ оплаты
    address: string;               // Адрес доставки
  }
  
  // Интерфейс для данных формы контактов
  export interface ContactsForm {
    email: string;                 // Email покупателя
    phone: string;                 // Телефон покупателя
  }