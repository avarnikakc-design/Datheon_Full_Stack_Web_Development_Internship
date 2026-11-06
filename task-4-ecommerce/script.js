let allProducts = [];
let cart = [];

const productGrid = document.getElementById('product-grid');
const catBtns = document.querySelectorAll('.cat-btn');
const searchInput = document.getElementById('search-input');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');

async function fetchProducts() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (error) {
        productGrid.innerHTML = '<p>Failed to load products.</p>';
    }
}

function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        
        if(category === 'all') {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === category);
            renderProducts(filtered);
        }
    });
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
    renderProducts(filtered);
});

window.addToCart = function(id) {
    const product = allProducts.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if(cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

window.updateQuantity = function(id, change) {
    const cartItem = cart.find(item => item.id === id);
    if(cartItem) {
        cartItem.quantity += change;
        if(cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let totalCount = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalCount += item.quantity;
        subtotal += item.price * item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartCount.textContent = totalCount;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

cartToggleBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.remove('hidden');
});

closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.add('hidden');
});

cartOverlay.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.add('hidden');
});

checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Order placed successfully! Thank you for shopping with LuxeCart.');
    cart = [];
    updateCartUI();
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('hidden');
});

fetchProducts();