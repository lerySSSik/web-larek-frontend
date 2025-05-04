# Проектная работа "Web-larek"
Интернет-магазин "Web-larek" для веб-разработчиков, где можно найти всё необходимое для успешной работы. Удобный каталог с подробными описаниями товаров, возможность добавления товаров в корзину и оформления заказов в пару кликов. Кроме того, вы можете детально ознакомиться с описанием каждого товара в карточке, чтобы выбрать именно то, что вам нужно.

## Оглавление
1. Обзор архитектуры
2. Технологический стек
3. Структура проекта
4. Важные файлы
5. Описание базовых классов
6. Слой модели данных Model
7. Слой представления View
8. Слой коммуникации
9. Установка и запуск
10. Сборка

## Обзор архитектуры
Проект реализован с использованием архитектурного паттерна MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственности между ключевыми компонентами системы:

1. Модели (Model) — управление данными и бизнес-логикой:
   - ProductModel — отвечает за управление каталогом товаров;
   - CardModel - отвечает за управление корзиной покупок;
   - OrderModel - оформление и валидация заказов; 

2. Представления (View) — визуализация пользовёательского интерфейса:
   - PageView — главная страница приложения с галереей товаров, где пользователи могут просматривать и выбирать интересующие их продукты;
   - CardViews - отображение корзины покупок в интерфейсе;
   - ContactForm - отвечает за форму контанктных данных при оформлении заказа;
   - FormPayment - отвечает за форму выбора способа оплаты и адреса доставки в процессе офофрмления заказа;
   - Forms - абстрактный класс для работы с формами, который реализует общую логику для всех форм приложения;
   - Modal - управление модальными окнами в интерфейсе;
   - ProductCard - создание и отображение карточек товаров;
   - SuccessModal - отображение модального окна с подтверждением успешного оформления заказа;

3. Презентер (EventEmitter) — координация взаимодействия между слоями:
   - EventEmitter — связующее звено между моделью и представлением, которое обрабатывает события и передает данные между ними;

## Технологический стек
- HTML: Разметка веб-страниц с помощью тегов.
- SCSS: Препроцессор CSS с переменными, миксинами и функциями.
- TypeScript: Надстройка над JavaScript с статической типизацией.
- Webpack: Модуль-сборщик для объединения файлов, управления зависимостями и оптимизации кода.

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/models/ — бизнес-логика и данные
- src/components/views/ — отображение интерфейса

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание классов и их функциональность

### Класс Api.
Базовый HTTP-клиент для взаимодействия с серверным API. Инкапсулирует логику выполнения запросов, обработки ответов и ошибок.

1. Типы :
    - ApiListResponce<Type> :
         {
            total: number;    
            items: Type[];   
        }
    - ApiPostMethods :
     Поддерживаемые методы для модифицирующих запросов: 'POST' | 'PUT' | 'DELETE';

2. Конструктор : 
    constructor(
        baseUrl: string,  // базовый URL API-сервера
        options: RequestInit = {} // стандарртные настройки HTTP-запросов
    )

3. Основные методы : 

    1. handleResponse(response: Response): Promise<object>:
        - Централизованный обработчик всех ответов сервера;
        - Проверяет статус ответа;
        - Обрабатывает сетевые ошибки и проблемы с парсингом;
        - Возвращает унифицированный формат данных для всего приложения;
    
    2. get<T>(uri: string): Promise<T>:
        - Выполняет GET-запрос к указанному эндпоинту;
        - Параметры :
            * uri — путь запроса;
    3. post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>:
        - Выполняет POST-запрос с передачей данных;
        - Пареметры :
            * uri - путь запроса;
            * data - тело запроса;
            * method - HTTP-метод;

### Класс EventEmitter.
    Реализация паттерна "Наблюдатель" (Observer) для управления событиями в приложении. 

1. Конструктор : 
    constructor() // не требует параметров для создания экземпляра

2. Основные методы :
    1. on<T = unknown>(event: string, callback: (data: T) => void): () => void:
        * Подписывает обработчик на указанное событие;
        - Параметры :
            * event - имя события;
            * callback - функция-обработчик, получающая данные события;
        - Возвращает функцию для отписки от события;
    2. off<T = unknown>(event: string, callback: (data: T) => void): void: 
        * Описывает конкретный обработчик от указанного события;
        - Параметры: 
            * event - название события;
            * callback - функция-обработчик, которую нужно удалить;
    3. emit<T = unknown>(event: string, data?: T): void:
        * Инициирует указанное событие;
        - Параметры :
            * event - имя события;
            * data - дополнительные данные для передачи обработчикам
    4. once<T = unknown>(event: string, callback: (data: T) => void): void:
        * Подписывает обработчик на событие, который автоматически отписывается после первого вызова;
            - Параметры: 
                * event - название события;
                * callback - функция-обработчик;
    5. getEventListeners(event?: string): Record<string, number> | number: 
        * Возвращает количество подписчиков на события;
            - Параметры :
                * event - название события;
            - Возвращает : 
                * Если передан event - количество обработчиков для этого события;
                * Если не передан - объект с количеством подписчиков для всех событий;
    6. clear(event?: string): void: 
        * Очищает подписки на события;
            - Параметры:
                * event - название события, если не указано, очищаются все подписки;

### Класс CartModel.
Модель корзины товаров, реализующая паттерн "Наблюдатель" через наследование от EventEmitter. Управляет состоянием корзины, включая добавление/удаление товаров, подсчет стоимости и количества. 

1. Наследование и инициализация :
    - Наследует EventEmitter;
    - Приватные поля: private _items: ProductCart[] = [];

2. Конструктор :
    constructor() {
        super();  
        this.emitChange(); 
    }

2. Основные методы :
    1.  addToCart(product: IProduct): void:
    - Добавляет товар в корзину или увеличивает его количество;
        * Проверяет валидность товара;
        * Если товар в корзине - увеличивает quanity на 1, в противном случае добавляет новый элемент с quanity = 1;
        * Автоматически уведомляет подписчиков через emitChange(); 
    2. removeFromCart(productId: string): void:
    - Удаляет товар из корзины по ID;
        * Фильтрует массив _items, исключая товар с указанным productId;
    3. clearCart(): void:
        * Полностью очищает корзину;
    4. getCartState(): BasketStatus:
        * Возвращет текущее состояние корзины:
        {
            items: ProductCart[],   
            totalPrice: number,  
            totalItems: number 
        }
    5. isProductValid(product: IProduct): boolean:
        * Проверяет, что товар можно добавить в корзину: return product.price != null; 
    6. findCartItem(productId: string): ProductCart | undefined: 
        * Находит товар в корзине по ID: return this._items.find(item => item.product.id === productId); 
    7. getItemsCopy(): ProductCart[]:
        * Создает глубокую копию списка товаров: return this._items.map(item => ({...item,product: { ...item.product }}));
    8. calculateTotalPrice(): number :
        * Считает общую стоимость: this._items.reduce((total, item)=> total + (item.product.price || 0) * item.quantity, 0);
    9. calculateTotalItems(): number:
        * Считает общее количество товаров: this._items.reduce((total, item) => total + item.quantity, 0);
    10. emitChange(): void :
        * Отправляет событие cart-change с текущим состоянием корзины: this.emit('cart-change', this.getCartState());

### Класс OrderModel.
Модель оформления заказа, реализующая паттерн "Наблюдатель" через наследование от EventEmitter. Отвечает за валидацию данных заказа и взаимодействие с API для его отправки.

1. Наследование и инициализация:
    - Наследует EventEmitter;

2. Конструктор : 
    - constructor(private api: Api)

3. Основные методы :
    1. submitOrder(order: Order): Promise<void> :
        * Отправляет заказ на сервер и уведомляет о результате;
        - Использует api.post с эндпоинтом /order;
    2. validateOrder(order: Partial<Order>): boolean: 
        * Проверяет корректность данных заказа. Возвращает true , если все поля валидны.
        - Проверяемые поля: 
            1. address:
                - Условия валидности: не пустая строка;
                - Ошибка : Некорректный адрес доставки;
            2. paument:
                - Условия валидности: 'cash' или 'card';
                - Ошибка : Некорректный способ оплаты;
            3. email:
                - Условия валидности: соответсвует шаблону email;
                - Ошибка : Некорректный email;
            3. phone:
                - Условия валидности: 11+ цифр;
                - Ошибка : Некорректный телефон;
            3. items:
                - Условия валидности: не пустой массив;
                - Ошибка : Корзина пуста;
            3. total:
                - Условия валидности: число > 0;
                - Ошибка : Некорректная сумма заказа;

4. События:
    1. order : success : срабатывает при устпешной отправке заказа;
    2. order : error : срабатывает при ошибке API;


### Класс ProductModel.
Модель данных для работы с продуктами, реализующая паттерн "Наблюдатель" через наследование от EventEmitter. Обеспечивает загрузку товаров с сервера, их хранение и предоставление по запросу.


1. Наследование и инициализация: 
    - Наследует EventEmitter; 
    - Приватные поля : private products: IProduct[] = []; private api: Api;  

2. Конструктор :
    constructor(api: Api) {
     super();
     this.api = api;  // Инъекция зависимости API-клиента
    }

3. Основные методы:
    1. fetchProducts(): Promise<void> :
        - Загружает список товаров с сервера и обновляет локальное хранилище;
        - Использует api.get с эндпоинтов product;
        - Ожидает ответ в формате ApiList<any>;
        - Приводит структуру товаров к единому формату IProduct;
        - При успехе генерирует событие products-updated с массивом товаров, в противном случае products-error с объектом ошибки;
    2. getProductById(id: string): IProduct | undefined:
        - Возвращает товар по ID из локального кеша: return this.products.find(product => product.id === id);
        - Возвращает IProduct если товар найден, в противном случае undefined;
    3. getAllProducts(): IProduct[]:
        - Возвращает копию массива всех загруженных товаров: return [...this.products];

4. События :
    1. products-updated : срабатывает при успешной загрузке товаров;
    2. products-error : срабатывает при ошибке загрузки;

### Класс CardViews. 
Компонент для отображения корзины товаров и управления UI элементами. Реализует рендеринг списка товаров, обновление счетчика и обработку пользовательских действий.

1. Конструктор :
    constructor(
        private eventEmitter: EventEmitter, 
        private onRemove: (product: IProduct) => void 
    )

2. DOM-элементы:
    private readonly template: HTMLTemplateElement;
    private readonly cardTemplate: HTMLTemplateElement; 
    private readonly basketButton: HTMLElement;
    private readonly basketCounter: HTMLElement;

2. Основные методы :
    1. render(state: BasketStatus): HTMLElement:
        - Генерирует и возвращает HTML корзине на основе текущего состояния;
        - Обновление счетчика: this.updateCounter(state.items.length);
        - Общая сумма: total.textContent = `${state.totalPrice} синапсов`;
    2. private updateCounter(count: number): void:
        * Обновляет отображение счетчика товаров;

3. Обработка событий :
    1. basketButton :
        - Событие : click;
        - Действие: генерирует cart:open;
    1. Кнопка удаления :
        - Событие : click;
        - Действие: вызывает onRemove с товаром;
    1. Кнопка оформления :
        - Событие : click;
        - Действие: генерирует order:submit;
        
### Класс ContactForm. 
Наследник класса Forms, реализующий форму контактов с валидацией email и телефона. Обеспечивает маску ввода для телефона и динамическую проверку данных.

1. Конструктор :
    constructor(onSubmit: (data: { email: string; phone: string }) => void) {
        super('contacts', onSubmit);  // Инициализация базовой формы с id 'contacts'
    }

2. Основные методы :
    1. validate(): boolean:
        - Проверяет коректность введеных данных;
    2. handleSubmit(e: Event): void:
        - Обрабатывает отправку формы;
    3. render(): HTMLFormElement :
        - Генерирует и возвращает DOM-элемент формы;
        - Добавялет обработчики :
            1. phoneInput :
                - Событие: input;
                - Действие: применяет маску телефона;
            2. emailInput :
                - Событие: input;
                - Действие: запускает валидацию;
            3. Форма:
                - Событие: submit;
                - Действие: вызывает handleSubmit;

### Класс FormPayment.
Наследник класса Forms, реализующий форму выбора способа оплаты и ввода адреса доставки. Обеспечивает валидацию данных и обработку пользовательских действий.

1. Наследование и инициализация :
    - Наследует Forms;
    - Поля :
    protected paymentButtons: HTMLButtonElement[]; 
    protected addressInput: HTMLInputElement;    

2. Конструктор:
    constructor(onSubmit: (data: { payment: string; address: string }) => void) {
        super('order', onSubmit);
    }

2. Основные методы :
    1. validate(): boolean:
        - Проверяет коректность введеных данных;
    2. handleSubmit(e: Event): void:
        - Обрабатывает отправку формы;
    3. render(): HTMLFormElement :
        - Генерирует и возвращает DOM-элемент формы;
        - Добавляет обработчики:
            1. paymentButtons :
                - Событие: click;
                - Действие : выбор способа оплаты;
            1. addressInput :
                - Событие: input;
                - Действие : запускате валидацию;
            1. Форма :
                - Событие: submit;
                - Действие : вызывает handleSubmit;
    

### Класс Forms.
Абстрактный базовый класс для создания форм с общей логикой валидации, отправки данных и отображения ошибок. Реализует паттерн "Шаблонный метод", оставляя конкретную реализацию валидации наследникам.

1. Структура :
    1. form: 
        - Тип: HTMLFormElement;
        - Описание: DOM-элемент формы;
    1. button: 
        - Тип: HTMLButtonElement;
        - Описание: кнопка отправки формы;
    1. errors: 
        - Тип: HTMLElement;
        - Описание: контейнер для отображения ошибок;
    1. formId: 
        - Тип: string;
        - Описание: ID шаблон формы в DOM;
    1. onSubmit: 
        - Тип: (data: object) => void;
        - Описание: колбэк для обработки данных формы;

2. Конструктор:
    constructor(formId: string, onSubmit: (data: object) => void)

3. Основные методы:
    1. render(): HTMLFormElement :
        - Создает и возвращает клон формы с настроенными обработчиками, использует FormData для сбора значений полей формы = конвертирует в обычный объект;
    2. showErrors(errors: string[]): void: 
        - Отображет ошибки валидации;
    3. clearErrors(): void :
        - Очищает блок с ошибками;
    4. protected abstract validate(): boolean :
        - Обязательный к реализации метод: должен содержать логику проверки данных формы, возвращать true если данные валидны, использовать showErrors() для отображения ошибок;
        - Вызывается в render() перед отправкой данных;

### Класс Modal.
Управление модальными окнами с функциональностью открытия/закрытия, обработкой событий и сохранением состояния формы. 

1. Конструктор:
        constructor()

2. Структура класса :
    1. element :
        - Тип: HTMLElement;
        - Описание: основной контейнер модального окна;
    2. content :
        - Тип: HTMLElement;
        - Описание: блок для контента модалки;
    3. closeButton :
        - Тип: HTMLElement;
        - Описание: кнопка закрытия;
    4. escHandler :
        - Тип: HTMLElement;
        - Описание: основной контейнер модального окна;
    5. element :
        - Тип: (e: KeyboardEvent) => void;
        - Описание: обработчик клавиши ESC;
    6. pageWrapper :
        - Тип: HTMLElement;
        - Описание: блок страницы для управления прокруткой;

3. Основные методы:
    1. open(content: HTMLElement): void :
        - Открывает модально окно с переданным контентом;
        - Блокирует прокрутку страницы;
        - Обрабатывает контент;
        - Активирует модальное окно;
    2. close(): void:
        - Закрывает модально окно;
    3. getContent(): HTMLElement :
        - Возвращает текущий контейнер контента;
    4. private getScrollbarWidth(): number :
        - Вычисляет ширину скроллбара браузера;
    5. private setupEventListeners(): void :
        - Устанавливает обработчики событий;
    6. private handleEscape(e: KeyboardEvent): void:
        - Обрабатывает нажатие esc -> закрытие модального окна;

### Класс PageView.
Представление главной страницы приложения, управляющее отображением галереи товаров и индикатором корзины. Реализует взаимодействие через EventEmitter.

1. Конструктор : 
    constructor(eventEmitter: EventEmitter)

2. Структура и инициализация: 
    1. gallery :
        - Тип: HTMLElement;
        - Описание: контейнер доя отображения товаров;
    2. basketButton :
        - Тип: HTMLElement;
        - Описание: кнопка корзины в хедере;
    3. basketCounter :
        - Тип: HTMLElement;
        - Описание: счетчик товаров в корзине;
    4. eventEmitter :
        - Тип: EventEmitter;
        - Описание: обработчик событий;

2. Основные методы :
    1. renderGallery(items: HTMLElement[]): void:
        - Очищает содержимое галереи товаров;
    2. updateBasketCounter(count: number): void :
        - Обновляет отображение счетчика товаров;
        - this.basketCounter.style.display = count > 0 ? 'flex' : 'none';

### Класс ProductCard.
Компонент для создания карточек товаров с поддержкой разных вариантов отображения (основной и превью). Обеспечивает единообразное отображение товаров с учетом их категорий.

1. Конструктор:
    constructor(template: HTMLTemplateElement, onClick: (productId: string) => void)

2. Структура и инициализация:
    1. template:
        - Тип: HTMLTemplateElement;
        - Описание: шаблон для создания карточек;
    2. onClick :
        - Тип: (productId: string) => void;
        - Описание: колбэк при клике на карточку;

3. Основные методы:
    1. private getCategoryClass(category: string): string:
        - Определяет CSS-класс для категории товара;
    2. render(product: IProduct): HTMLElement:
        - Создает DOM-элемент карточки товара;
    3. renderPreview(product: IProduct): HTMLElement :
        - Создает DOM-элемент превью карточки;

### Класс ProductCard.
Компонент для отображения модального окна успешного оформления заказа. Реализует простой механизм рендеринга и обработки закрытия. 

1. Конструктор: 
    constructor(onClose: () => void)

2. Основной метод:
    1. render(totalPrice: number): HTMLElement:
        - Создает и возвращает DOM-элемент модального окна;

## Типы данных
### Карта товара
interface IProduct {
  id: string;                   
  title: string;                
  price: number;                
  description: string;          
  category: string;             
  image: string;                
}

### Товар в корзине
interface ProductCart {
  product: IProduct;             
  quantity: number;             
 }

### Состояние корзины
interface BasketStatus {
  items: ProductCart[];             
  totalPrice: number;  
  totalItems: number;        
  }

### Данные при оформлении заказа 
interface Order {
  address: string;     
  payment: string;              
  email: string;         
  phone: string;           
  items: string[];        
  total: number;           
  }

### Для отправки формы оплаты 
interface FormPayments {
  payment: string;             
  address: string;              
  }

### Для данных формы контактов 
export interface ContactsForm {
  email: string;             
  phone: string;               
  }


## UML
![UML](src/docs/UMl.drawio.svg)

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
