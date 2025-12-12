document.addEventListener('DOMContentLoaded', () => {
    const CART_STORAGE_KEY = 'shoppingCart';
    const cartItemsDiv = document.getElementById('cart-items-container');
    const totalP = document.getElementById('total');

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
        if (cartItemsDiv) renderCart();
    }

    function parsePrice(priceText) {
        let price = priceText.toString().replace(/[^\d\.,]/g, '');
        if (price.includes(',')) price = price.replace(',', '.');
        return parseFloat(price) || 0;
    }

    function showCartPopup(message, className) {
        const existingPopup = document.getElementById('dynamic-popup');
        if (existingPopup) existingPopup.remove();
        const overlay = document.createElement('div');
        overlay.id = 'dynamic-popup';
        overlay.classList.add('popup-overlay-animated', 'fade-in', className);
        const box = document.createElement('div');
        box.classList.add('popup-box-animated');
        const msg = document.createElement('h3');
        msg.innerHTML = message;
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fortsätt handla';
        const cartLink = document.createElement('a');
        cartLink.href = 'kundvagn.html';
        cartLink.textContent = 'Gå till kundvagn';
        cartLink.classList.add('btn');
        box.appendChild(msg);
        box.appendChild(cartLink);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        function removePopup() {
            overlay.classList.remove('fade-in');
            overlay.classList.add('fade-out');
            setTimeout(() => { overlay.remove(); }, 300);
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn) {
                removePopup();
            }
        });
        setTimeout(removePopup, 3000);
    }

    function createPopup(message, buttonText, action) {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay-animated');
        overlay.id = 'generic-popup';
        const box = document.createElement('div');
        box.classList.add('popup-box-animated');
        const msg = document.createElement('h3');
        msg.innerHTML = message;
        const btn = document.createElement('button');
        btn.textContent = buttonText;
        btn.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                if (action) action();
            }, 300);
        });
        box.appendChild(msg);
        box.appendChild(btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.classList.add('fade-in'); });
    }

    function renderCart() {
        if (!cartItemsDiv || !totalP) return;
        const cart = getCart();
        cartItemsDiv.innerHTML = "";
        let total = 0;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = "<p>Kundvagnen är tom.</p>";
        } else {
            cart.forEach((item, index) => {
                let priceValue = parsePrice(item.price || '0');
                let itemQuantity = item.quantity || 1;
                total += priceValue * itemQuantity;
                const itemDiv = document.createElement("div");
                itemDiv.className = "cart-item";
                itemDiv.innerHTML = `
                    <span>${itemQuantity} x ${item.name} (${item.color || ''}, ${item.size || ''}) - ${(priceValue * itemQuantity).toFixed(2)}kr</span>
                    <button data-index="${index}" class="remove-item-btn">Ta bort</button>
                `;
                cartItemsDiv.appendChild(itemDiv);
            });
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', function() {
                    removeItem(parseInt(this.dataset.index));
                });
            });
        }
        totalP.textContent = `Total: ${total.toFixed(2)}kr`;
    }

    window.removeItem = function(index) {
        let cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
    }

    if (document.getElementById("clear-cart")) {
        document.getElementById("clear-cart").addEventListener("click", () => {
            saveCart([]);
        });
    }

    if (cartItemsDiv) renderCart();

    const laggtillKnapp = document.querySelector('.btn-laggtill');

    if (laggtillKnapp) {
        const fargKnappar = document.querySelectorAll('.farg-knapp');
        const storlekKnappar = document.querySelectorAll('.storlek-knapp:not(:disabled)');
        const valdFargSpan = document.getElementById('vald-farg');
        const produktTitelElement = document.querySelector('.produkt-titel');
        const produktPrisElement = document.querySelector('.produkt-pris');
        const huvudbild = document.getElementById('produktHuvudbild');
        if (!produktTitelElement || !produktPrisElement) return;

        const produktTitel = produktTitelElement.textContent.trim();
        const produktPrisText = produktPrisElement.textContent.trim();
        const produktPris = parsePrice(produktPrisText);

        let valdFarg = valdFargSpan?.textContent.trim() || document.querySelector('.farg-knapp.aktiv')?.getAttribute('data-farg') || 'Svart';
        let valdStorlek = document.querySelector('.storlek-knapp.aktiv')?.textContent.trim() || 'M';

        if (!document.querySelector('.storlek-knapp.aktiv') && storlekKnappar.length > 0) {
            const defaultButton = Array.from(storlekKnappar).find(b => b.textContent.trim() === 'M') || storlekKnappar[0];
            defaultButton.classList.add('aktiv');
            valdStorlek = defaultButton.textContent.trim();
        }

        fargKnappar.forEach(knapp => {
            knapp.addEventListener('click', function() {
                fargKnappar.forEach(k => k.classList.remove('aktiv'));
                this.classList.add('aktiv');
                valdFarg = this.getAttribute('data-farg');
                if (valdFargSpan) valdFargSpan.textContent = valdFarg;
                const nyBildSrc = this.getAttribute('data-img');
                if (huvudbild && nyBildSrc) {
                    huvudbild.setAttribute('src', nyBildSrc);
                    huvudbild.setAttribute('alt', `${produktTitel} (${valdFarg})`);
                }
            });
        });

        storlekKnappar.forEach(knapp => {
            knapp.addEventListener('click', function() {
                storlekKnappar.forEach(k => k.classList.remove('aktiv'));
                this.classList.add('aktiv');
                valdStorlek = this.textContent.trim();
            });
        });

        laggtillKnapp.addEventListener('click', () => {
            if (!valdFarg || !valdStorlek) {
                alert("Vänligen välj både färg och storlek.");
                return;
            }
            const cart = getCart();
            const produktId = `${produktTitel}-${valdFarg}-${valdStorlek}`;
            const aktuellProduktBild = huvudbild ? huvudbild.getAttribute('src') : '';
            const befintligArtikel = cart.find(item => item.id === produktId);

            if (befintligArtikel) {
                befintligArtikel.quantity += 1;
            } else {
                const nyArtikel = {
                    id: produktId,
                    name: produktTitel,
                    color: valdFarg,
                    size: valdStorlek,
                    price: produktPris,
                    image: aktuellProduktBild,
                    quantity: 1
                };
                cart.push(nyArtikel);
            }
            saveCart(cart);
            showCartPopup(`Lades till i kundvagnen:<br><b>${produktTitel}</b><br>(${valdFarg}, ${valdStorlek})`, 'produkt-köpt');
        });
    }

    document.querySelectorAll('.add-to-cart-simple').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const card = event.target.closest('.card');
            if (!card) return;
            const productTitle = card.querySelector('h3')?.textContent || 'Okänd Produkt';
            const productPrice = parsePrice(card.dataset.pris || '0');
            const productVariant = card.dataset.variant || 'Svart / M';
            const productImgSrc = card.querySelector('img')?.getAttribute('src') || '';
            const [color, size] = productVariant.split(' / ').map(s => s.trim());
            const produktId = `${productTitle}-${color}-${size}`;
            const cart = getCart();
            const befintligArtikel = cart.find(item => item.id === produktId);

            if (befintligArtikel) {
                befintligArtikel.quantity += 1;
            } else {
                const nyArtikel = {
                    id: produktId,
                    name: productTitle,
                    size: size,
                    color: color,
                    price: productPrice,
                    image: productImgSrc,
                    quantity: 1
                };
                cart.push(nyArtikel);
            }
            saveCart(cart);
            showCartPopup(`Lades till i kundvagnen:<br><b>${productTitle}</b><br>(${color}, ${size})`, 'produkt-köpt');
        });
    });

    const payForm = document.getElementById('payForm') || document.querySelector('.payform');
    const emailInput = document.querySelector('input[name="email"]');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment_method"]');
    const cardFields = document.getElementById('cardFields');
    const payButton = payForm ? payForm.querySelector('button[type="submit"]') : null;

    function updatePaymentView() {
        if (!payForm) return;
        const checkedMethod = document.querySelector('input[name="payment_method"]:checked');
        const method = checkedMethod ? checkedMethod.value : 'card';
        if (cardFields) { cardFields.style.display = (method === 'card') ? 'block' : 'none'; }
        if (payButton) {
            payButton.textContent = method === 'card' ? 'Betala med kort' :
                                    method === 'applepay' ? 'Gå till Apple Pay' :
                                    method === 'paypal' ? 'Gå till PayPal' :
                                    method === 'klarna' ? 'Gå till Klarna' : 'Betala';
        }
    }

    paymentMethodInputs.forEach(input => input.addEventListener('change', updatePaymentView));
    if (payForm) updatePaymentView();

    if (payForm) {
        payForm.addEventListener('submit', e => {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) {
                createPopup('Vänligen lägg till varor i kundvagnen', 'Hem', () => { window.location.href = 'index.html'; });
                return;
            }
            const email = emailInput ? emailInput.value : 'okänd@email.com';
            createPopup(`Betalning genomförd!<br>En bekräftelse skickas till <b>${email}</b>`, 'Hem', () => {
                window.location.href = 'index.html';
            });
            localStorage.removeItem(CART_STORAGE_KEY);
        });
    }
});