// Cart functionality
let cart = [];
let cartTotal = 0;

// Add item to cart
function addToCart(name, price) {
   const existingItem = cart.find(item => item.name === name);
   
   if (existingItem) {
       existingItem.quantity += 1;
   } else {
       cart.push({
           name: name,
           price: price,
           quantity: 1
       });
   }
   
   updateCartDisplay();
   showNotification(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(name) {
   cart = cart.filter(item => item.name !== name);
   updateCartDisplay();
   showNotification('Item removed from cart');
}

// Update item quantity
function updateQuantity(name, change) {
   const item = cart.find(item => item.name === name);
   if (item) {
       item.quantity += change;
       if (item.quantity <= 0) {
           removeFromCart(name);
       } else {
           updateCartDisplay();
       }
   }
}

// Update cart display
function updateCartDisplay() {
   const cartCount = document.getElementById('cart-count');
   const cartItems = document.getElementById('cart-items');
   const cartTotalElement = document.getElementById('cart-total');
   
   // Update cart count
   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
   cartCount.textContent = totalItems;
   
   // Update cart total
   cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
   cartTotalElement.textContent = cartTotal;
   
   // Update cart items display
   if (cart.length === 0) {
       cartItems.innerHTML = '<p style="text-align: center; color: #ccc;">Your cart is empty</p>';
   } else {
       cartItems.innerHTML = cart.map(item => `
           <div class="cart-item">
               <div class="cart-item-info">
                   <h4>${item.name}</h4>
                   <p>MVR ${item.price}/- each</p>
               </div>
               <div class="quantity-controls">
                   <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                   <span style="color: #ffd700; font-weight: bold;">${item.quantity}</span>
                   <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                   <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
               </div>
           </div>
       `).join('');
   }
}

// Open cart modal
function openCart() {
   document.getElementById('cartModal').style.display = 'block';
   updateCartDisplay();
}

// Close cart modal
function closeCart() {
   document.getElementById('cartModal').style.display = 'none';
}

// Show menu category
function showCategory(category) {
   // Hide all categories
   const categories = document.querySelectorAll('.menu-category');
   categories.forEach(cat => cat.classList.remove('active'));
   
   // Show selected category
   document.getElementById(category).classList.add('active');
   
   // Update active button
   const buttons = document.querySelectorAll('.category-btn');
   buttons.forEach(btn => btn.classList.remove('active'));
   event.target.classList.add('active');
}

// Show notification
function showNotification(message) {
   // Create notification element
   const notification = document.createElement('div');
   notification.textContent = message;
   notification.style.cssText = `
       position: fixed;
       top: 100px;
       right: 20px;
       background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
       color: #1a1a1a;
       padding: 1rem 2rem;
       border-radius: 25px;
       font-weight: bold;
       z-index: 3000;
       animation: slideIn 0.3s ease;
       box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
   `;
   
   // Add animation styles
   const style = document.createElement('style');
   style.textContent = `
       @keyframes slideIn {
           from { transform: translateX(100%); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
       }
       @keyframes slideOut {
           from { transform: translateX(0); opacity: 1; }
           to { transform: translateX(100%); opacity: 0; }
       }
   `;
   document.head.appendChild(style);
   
   document.body.appendChild(notification);
   
   // Remove notification after 3 seconds
   setTimeout(() => {
       notification.style.animation = 'slideOut 0.3s ease';
       setTimeout(() => {
           document.body.removeChild(notification);
       }, 300);
   }, 3000);
}

// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', function(e) {
   e.preventDefault();
   
   if (cart.length === 0) {
       alert('Your cart is empty!');
       return;
   }
   
   const customerName = document.getElementById('customer-name').value;
   const customerPhone = document.getElementById('customer-phone').value;
   const customerAddress = document.getElementById('customer-address').value;
   const specialInstructions = document.getElementById('special-instructions').value;
   
   // Create order summary
   let orderSummary = `New Order from Island Prime Website\n\n`;
   orderSummary += `Customer: ${customerName}\n`;
   orderSummary += `Phone: ${customerPhone}\n`;
   orderSummary += `Address: ${customerAddress}\n`;
   if (specialInstructions) {
       orderSummary += `Special Instructions: ${specialInstructions}\n`;
   }
   orderSummary += `\nOrder Details:\n`;
   orderSummary += `${'='.repeat(30)}\n`;
   
   cart.forEach(item => {
       orderSummary += `${item.name} x${item.quantity} - MVR ${item.price * item.quantity}/-\n`;
   });
   
   orderSummary += `${'='.repeat(30)}\n`;
   orderSummary += `Total: MVR ${cartTotal}/-\n`;
   orderSummary += `\nPlease contact customer to confirm order.`;
   
   // Create Viber link
   const viberMessage = encodeURIComponent(orderSummary);
   const viberLink = `viber://chat?number=96099868959&text=${viberMessage}`;
   
   // Open Viber
   window.open(viberLink, '_blank');
   
   // Clear cart and close modal
   cart = [];
   updateCartDisplay();
   closeCart();
   
   // Reset form
   document.getElementById('checkout-form').reset();
   
   showNotification('Order sent to Viber! We will contact you shortly.');
});

// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
   navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
   link.addEventListener('click', () => {
       navMenu.classList.remove('active');
   });
});

// Close cart modal when clicking outside
window.addEventListener('click', function(event) {
   const modal = document.getElementById('cartModal');
   if (event.target === modal) {
       closeCart();
   }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
       e.preventDefault();
       const target = document.querySelector(this.getAttribute('href'));
       if (target) {
           target.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
           });
       }
   });
});

// Search functionality
function createSearchFunction() {
   const searchContainer = document.createElement('div');
   searchContainer.style.cssText = `
       text-align: center;
       margin: 2rem 0;
       position: relative;
   `;
   
   const searchInput = document.createElement('input');
   searchInput.type = 'text';
   searchInput.placeholder = 'Search menu items...';
   searchInput.id = 'menu-search';
   searchInput.style.cssText = `
       width: 100%;
       max-width: 400px;
       padding: 1rem;
       border: 2px solid #ffd700;
       border-radius: 25px;
       background: #2d2d2d;
       color: white;
       font-size: 1rem;
       text-align: center;
   `;
   
   searchContainer.appendChild(searchInput);
   
   // Insert search after menu categories
   const menuCategories = document.querySelector('.menu-categories');
   menuCategories.parentNode.insertBefore(searchContainer, menuCategories.nextSibling);
   
   // Search functionality
   searchInput.addEventListener('input', function() {
       const searchTerm = this.value.toLowerCase();
       const menuItems = document.querySelectorAll('.menu-item');
       
       menuItems.forEach(item => {
           const itemName = item.querySelector('h4').textContent.toLowerCase();
           const itemCategory = item.closest('.menu-category');
           
           if (itemName.includes(searchTerm)) {
               item.style.display = 'block';
               if (searchTerm && !itemCategory.classList.contains('active')) {
                   // Show all categories that have matching items
                   itemCategory.style.display = 'block';
               }
           } else {
               item.style.display = 'none';
           }
       });
       
       // If search is empty, show only active category
       if (!searchTerm) {
           document.querySelectorAll('.menu-category').forEach(category => {
               if (!category.classList.contains('active')) {
                   category.style.display = 'none';
               }
           });
           document.querySelectorAll('.menu-item').forEach(item => {
               item.style.display = 'block';
           });
       }
   });
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', function() {
   createSearchFunction();
   updateCartDisplay();
});

// Add loading animation for menu items
document.addEventListener('DOMContentLoaded', function() {
   const menuItems = document.querySelectorAll('.menu-item');
   menuItems.forEach((item, index) => {
       item.style.opacity = '0';
       item.style.transform = 'translateY(20px)';
       
       setTimeout(() => {
           item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
           item.style.opacity = '1';
           item.style.transform = 'translateY(0)';
       }, index * 50);
   });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
   // Escape key to close cart
   if (e.key === 'Escape') {
       closeCart();
   }
   
   // Ctrl/Cmd + K to focus search
   if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
       e.preventDefault();
       const searchInput = document.getElementById('menu-search');
       if (searchInput) {
           searchInput.focus();
       }
   }
});