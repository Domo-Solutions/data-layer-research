document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");

    const productosContainer = document.querySelector("#productos-container");
    console.log("Contenedor: " + productosContainer);


    //Fetch de datos
    async function loadData() {
        try {
            const response = await fetch('./scripts/productos-layer.json');
            const jsonData = await response.json();
            const products = jsonData.products;
            console.log(products);
            initializeProductCards(products);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    loadData();

    //Variables globales
    let productList;
    let popup;
    let popupTitle;
    let popupId;
    let popupBrand;
    let popupCategory;
    let popupPrice;
    let closePopupButton;

    //Inicialización de product-list
    function initializeProductCards(products) {
        const productList = document.getElementById('product-list');
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupId = document.getElementById('popup-id');
        const popupBrand = document.getElementById('popup-brand');
        const popupCategory = document.getElementById('popup-category');
        const popupPrice = document.getElementById('popup-price');
        const closePopupButton = document.getElementById('close-popup');

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>ID: ${product.id}</p>
                <p>Brand: ${product.brand}</p>
                <p>Category: ${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="view-content-btn" 
                data-product-name="${product.name}" 
                data-product-id="${product.id}"
                data-product-brand="${product.brand}"
                data-product-category="${product.category}"
                data-product-price="${product.price}"
                >Ver contenido</button>
            `;

            productCard.querySelector('.view-content-btn').addEventListener('click', () => {
                popupTitle.textContent = product.name;
                popupId.textContent = `ID: ${product.id}`;
                popupBrand.textContent = `Brand: ${product.brand}`;
                popupCategory.textContent = `Category: ${product.category}`;
                popupPrice.textContent = `Price: $${product.price.toFixed(2)}`;

                popup.style.display = 'flex';

                const addToCartButton = popup.querySelector('#add-to-cart');

                // Actualiza los atributos de datos con los detalles del producto actual
                addToCartButton.setAttribute('data-product-name', product.name);
                addToCartButton.setAttribute('data-product-id', product.id);
                addToCartButton.setAttribute('data-product-brand', product.brand);
                addToCartButton.setAttribute('data-product-category', product.category);
                addToCartButton.setAttribute('data-product-price', product.price);
            });

            productList.appendChild(productCard);
        });

        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Agregar producto al carrito de productos
    function handleAddToCartClick(event) {
        const button = event.target;

        const productToAdd = {
            name: button.getAttribute('data-product-name'),
            id: button.getAttribute('data-product-id'),
            price: parseFloat(button.getAttribute('data-product-price')),
            brand: button.getAttribute('data-product-brand'),
            category: button.getAttribute('data-product-category')
        };

        cart.push(productToAdd);
        updateCart();
        document.getElementById('popup').style.display = 'none';
    }

    document.getElementById('add-to-cart').addEventListener('click', handleAddToCartClick);

    // Variables globales inicializadas
    const cart = [];
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('begin-checkout');
    const cartPopup = document.getElementById('cart-popup');
    const cartPopupItems = document.getElementById('cart-popup-items');
    const cartPopupTotalPrice = document.getElementById('cart-popup-total-price');
    const closeCartPopupButton = document.getElementById('close-cart-popup');
    const purchaseButton = document.getElementById('purchase-button');

    // Actualizar el carrito en la interfaz
    function updateCart() {
        cartItems.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price.toFixed(2)}`;
            cartItems.appendChild(li);
            totalPrice += product.price;
        });

        totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    //Abrir el modal del carrito
    function openCartPopup() {
        cartPopupItems.innerHTML = '';
        let totalPopupPrice = 0;

        cart.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price.toFixed(2)}`;
            cartPopupItems.appendChild(li);
            totalPopupPrice += product.price;
        });

        cartPopupTotalPrice.textContent = `Total: $${totalPopupPrice.toFixed(2)}`;
        cartPopup.style.display = 'flex';
    }

    // Enviar la información del carrito al data layer al hacer clic en "Continuar Compra"
    checkoutButton.addEventListener('click', () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'begin_checkout',
            'cart-content': cart.map(product => ({
                'item-name': product.name,
                'item-id': product.id,
                'item-price': product.price,
                'item-brand': product.brand,
                'item-category': product.category
            })),
            'cart-value': cart.reduce((total, product) => total + product.price, 0)
        });

        console.log(cart)

        openCartPopup();
    });


    closeCartPopupButton.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    cartPopup.addEventListener('click', (event) => {
        if (event.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });

    // Enviar la información del carrito al data layer al hacer clic en "Comprar"
    purchaseButton.addEventListener('click', () => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'purchase',
            'cart-content': cart.map(product => ({
                'item-name': product.name,
                'item-id': (product.id),
                'item-price': product.price,
                'item-brand': product.brand,
                'item-category': product.category
            })),
            'cart-value': cart.reduce((total, product) => total + product.price, 0)
        });
        alert('¡Gracias por tu compra!');
        cart.length = 0;
        updateCart();
        cartPopup.style.display = 'none';
    });
});
