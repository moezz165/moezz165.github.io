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

    document.querySelectorAll('.farg-knapp').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.farg-knapp').forEach(btn => btn.classList.remove('aktiv'));
            this.classList.add('aktiv');
            const valdFargElement = document.getElementById('vald-farg');
            if (valdFargElement) valdFargElement.textContent = this.dataset.farg;
        });
    });

    document.querySelectorAll('.storlek-knapp').forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function() {
                document.querySelectorAll('.storlek-knapp').forEach(btn => btn.classList.remove('aktiv'));
                this.classList.add('aktiv');
            });
        }
    });

    const addToCartButton = document.querySelector('.btn-laggtill');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const selectedSize = document.querySelector('.storlek-knapp.aktiv');
            const selectedColor = document.querySelector('.farg-knapp.aktiv');
            const productTitle = document.querySelector('.produkt-titel')?.textContent || 'Okänd Produkt';
            const productPriceText = document.querySelector('.produkt-pris')?.textContent || '0 kr';
            
        
            const productPrice = parseFloat(productPriceText.replace(' kr', '').replace(',', '.'));

            if (!selectedSize || !selectedColor) {
       
                showPopup('Vänligen välj både färg och storlek innan du lägger till i kundvagnen.', 'felmeddelande');
                return;
            }

            const item = {
                id: Date.now(),
                name: productTitle,
                size: selectedSize.textContent.trim(),
                color: selectedColor.dataset.farg,
                price: productPrice,
                quantity: 1
            };

            const cart = getCart();
            cart.push(item);
            saveCart(cart);

            showPopup('Produkten har lagts till i kundvagnen!', 'produkt-köpt');
        });
    }
});