    document.addEventListener('DOMContentLoaded', () => {

        const CART_STORAGE_KEY = 'shoppingCart';

        function getCart() {
            try {
                const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
                return Array.isArray(cart) ? cart : [];
            } catch (e) {
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
            popup.innerHTML = message;
            document.body.appendChild(popup);

            setTimeout(() => {
                popup.remove();
            }, 3000);
        }


        const productForm = document.getElementById('productForm');
        const popup = document.getElementById('popup');

        if (productForm) {
            productForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const cart = getCart();
                cart.push({ id: Date.now(), name: "Generisk produkt", quantity: 1 });
                saveCart(cart);

                if (popup) {
                    popup.textContent = 'Produkt lades till i kundvagnen.';
                    popup.classList.add('show');

                    setTimeout(() => {
                        popup.classList.remove('show');
                    }, 3000);
                }
            });
        }

        document.querySelectorAll('.farg-knapp').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.farg-knapp').forEach(btn => btn.classList.remove('aktiv'));
                this.classList.add('aktiv');

                const valdFargElement = document.getElementById('vald-farg');
                if (valdFargElement) {
                    valdFargElement.textContent = this.dataset.farg;
                }
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

        const addToCartButtonNew = document.querySelector('.btn-laggtill');
        if (addToCartButtonNew) {
            addToCartButtonNew.addEventListener('click', function() {
                const selectedSize = document.querySelector('.storlek-knapp.aktiv');
                const selectedColor = document.querySelector('.farg-knapp.aktiv');
                const productTitle = document.querySelector('.produkt-titel')?.textContent || 'Okänd Produkt';
                const productPrice = document.querySelector('.produkt-pris')?.textContent || '0 SEK';

                if (!selectedSize || !selectedColor) {
                    alert('Vänligen välj både färg och storlek innan du lägger till i kundvagnen.');
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

        const payform = document.querySelector('.payform');
        if (payform) {
            payform.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = payform.querySelector('input[type="email"]');
                const userEmail = emailInput ? emailInput.value : 'okänd@email.com';

                if (!emailInput || emailInput.value.trim() === '') {
                    alert('Vänligen ange din e-postadress.');
                    return;
                }

                if (getCart().length === 0) {
                    showPopup('Din kundvagn är tom. Lägg till produkter först.', 'produkt-köpt');
                    return;
                }

                localStorage.removeItem(CART_STORAGE_KEY);

                const successMessage = `Tack för din betalning! En bekräftelse skickas till ${userEmail}.`;
                showPopup(successMessage, 'produkt-köpt');

                if (emailInput) {
                    emailInput.value = '';
                }
            });
        }
    });
    