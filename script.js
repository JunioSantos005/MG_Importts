// Sample product data
const products = [
    { 
        id: 1, 
        name: "Camisa do Palmeiras", 
        icon: "👕", 
        image: "/palmeiras.jpg",
        description: "Camisa clássica do Palmeiras, verde e tradicional."
    },

    { 
        id: 2, 
        name: "Camisa do São paulo ", 
        icon: "", 
        image: "/saopaulo.jpg",
        description: "Camisa premium." 
    },

    {
        id: 3, 
        name: "Palmeiras e São Paulo ", 
        icon: "", 
        image: "/palmeiras_saopaulo.jpg",
        description: "Camisa esportiva." 
    },

    { 
        id: 4, 
        name: "Regata da Golden States ", 
        icon: "👕", 
        image: "/esportiva1.jpg",
        description: "Kayhê é meu pato."
    },

    { 
        id: 5, 
        name: "Conjunto Social ", 
        icon: "👕", 
        image: "/social1.jpg",
        description: "Kayhê é meu pato."
    },

    { 
        id: 6, 
        name: "Camisa Social ", 
        icon: "", 
        image: "/social2.jpg",
        description: "Kayhê é meu pato." 
    },

    {
        id: 7, 
        name: "Conjunto ", 
        icon: "", 
        image: "/social3.jpg",
        description: "Kayhê é meu pato." 
    },

    { 
        id: 8, 
        name: "Camiseta Lacoste", 
        icon: "👕", 
        image: "/social4.jpg",
        description: "Kayhê é meu pato."
    },
];

// Cart array to store scheduled items
let cart = [];
let currentEditingItem = null;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const cartItems = document.getElementById('cart-items');
const searchInput = document.getElementById('search-input');
const cartCount = document.querySelector('.cart-count');

// Initialize the store
function initStore() {
    renderProducts(products);
    updateCartCount();
    
    // Event Listeners
    cartBtn.addEventListener('click', openCartModal);
    searchInput.addEventListener('input', handleSearch);
    
    // Close modals when clicking on X or outside
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
}

// Substitua a função renderProducts por esta versão atualizada
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isAgendada = cart.some(item => item.id === product.id);
        
        // Use image if available, otherwise use icon
        const productVisual = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-img">`
            : `<div class="product-image">${product.icon}</div>`;
        
        // Mensagem de agendada se estiver no carrinho
        const agendadaOverlay = isAgendada 
            ? `<div class="agendada-overlay">
                  <div class="agendada-text">Já Agendada ✓</div>
               </div>` 
            : '';
        
        productCard.innerHTML = `
            ${productVisual}
            ${agendadaOverlay}
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-actions">
                    <button class="btn btn-primary schedule-product" data-id="${product.id}" ${isAgendada ? 'disabled' : ''}>
                        ${isAgendada ? 'Já Agendada' : 'Resevar'}
                    </button>
                    <button class="btn btn-secondary view-product" data-id="${product.id}">Inspecionar</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to the buttons
    document.querySelectorAll('.schedule-product').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                scheduleProduct(productId);
            });
        }
    });
    
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            openProductModal(productId);
        });
    });
}

// Atualize a função scheduleProduct para recarregar os produtos
function scheduleProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product && !cart.some(item => item.id === productId)) {
        cart.push({...product});
        updateCartCount();
        renderProducts(products); // Recarrega os produtos para mostrar a mensagem
        alert(`${product.name} foi agendada com sucesso!`);
    } else {
        alert('Esta camisa já está agendada!');
    }
}

// Atualize a função removeFromCart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    renderProducts(products); // Recarrega os produtos para remover a mensagem
}

// Atualize a função editCartItem
function editCartItem(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        currentEditingItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartCount();
        renderCartItems();
        renderProducts(products); // Recarrega os produtos para remover a mensagem
        closeModals();
        
        // Show available products for selection
        alert(`Você está editando ${currentEditingItem.name}. Selecione uma nova camisa.`);
    }
}

// Update cart count display
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Open cart modal
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'flex';
}

// Render cart items
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Nenhuma camisa agendada</div>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="product-name">${item.name}</div>
            </div>
            <div class="cart-item-actions">
                <button class="action-btn edit-btn" data-id="${item.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            editCartItem(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Open product detail modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('product-modal-title').textContent = product.name;
        document.getElementById('product-detail-name').textContent = product.name;
        
        // Use image if available, otherwise use icon
        const productDetailVisual = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-detail-img">`
            : `<div>${product.icon}</div>`;
        
        document.getElementById('product-detail-image').innerHTML = productDetailVisual;
        document.getElementById('product-detail-desc').textContent = product.description;
        
        // Update schedule button
        const scheduleBtn = document.getElementById('schedule-btn');
        const isInCart = cart.some(item => item.id === productId);
        scheduleBtn.textContent = isInCart ? 'Já Agendada' : 'Resevar Camisa';
        scheduleBtn.disabled = isInCart;
        
        if (!isInCart) {
            scheduleBtn.onclick = () => {
                scheduleProduct(productId);
                closeModals();
            };
        }
        
        productModal.style.display = 'flex';
    }
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

// Close all modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', initStore);