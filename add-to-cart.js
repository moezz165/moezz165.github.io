

document.addEventListener('DOMContentLoaded', () => {
    const CART_STORAGE_KEY = 'shoppingCart';

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
            return Array.isArray(cart) ? cart : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    function showPopup(message, className) {
        const existingPopup = document.getElementById('dynamic-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'dynamic-popup';
        popup.classList.add(className);
        popup.textContent = message;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    document.querySelectorAll('.add-to-cart-simple').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const card = event.target.closest('.card');
            if (!card) return;

            const productTitle = card.querySelector('h3')?.textContent || 'Okänd Produkt';
            const productPriceText = card.dataset.pris || '0 kr';
            const productVariant = card.dataset.variant || 'Svart / M'; 
  
            const productPrice = parseFloat(productPriceText.replace('kr', '').replace(',', '.'));

            const [color, size] = productVariant.split(' / ').map(s => s.trim());
            
            const item = {
                id: Date.now(),
                name: productTitle,
                size: size,
                color: color,
                price: productPrice,
                quantity: 1
            };

            const cart = getCart();
            cart.push(item);
            saveCart(cart);

            showPopup(`${productTitle} (${color}, ${size}) har lagts till i kundvagnen!`, 'produkt-köpt');
        });
    });
});