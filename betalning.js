document.addEventListener('DOMContentLoaded', () => {
    const CART_STORAGE_KEY = 'shoppingCart';
    const payForm = document.getElementById('payForm');
    const emailInput = document.querySelector('input[name="email"]');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment_method"]');
    const cardFields = document.getElementById('cardFields');
    const payButton = document.querySelector('#payForm button[type="submit"]');

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
            return Array.isArray(cart) ? cart : [];
        } catch {
            return [];
        }
    }

    function createPopup(message, buttonText, action) {
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay-animated');

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

        requestAnimationFrame(() => {
            overlay.classList.add('fade-in');
        });
    }

    function updatePaymentView() {
        const method = document.querySelector('input[name="payment_method"]:checked').value;
        if (method === 'card') {
            cardFields.style.display = 'block';
            payButton.textContent = 'Betala med kort';
        } else {
            cardFields.style.display = 'none';
            payButton.textContent = method === 'applepay' ? 'Gå till Apple Pay' :
                                    method === 'paypal' ? 'Gå till PayPal' :
                                    method === 'klarna' ? 'Gå till Klarna' : 'Betala';
        }
    }

    paymentMethodInputs.forEach(input => input.addEventListener('change', updatePaymentView));
    updatePaymentView();

    if (payForm) {
        payForm.addEventListener('submit', e => {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) {
                createPopup('Vänligen lägg till varor i kundvagnen', 'OK', () => { window.location.href = 'index.html'; });
                return;
            }
            const email = emailInput.value;
            createPopup(`Betalning genomförd!<br>En bekräftelse skickas till <b>${email}</b>`, 'Hem', () => { window.location.href = 'index.html'; });
            localStorage.removeItem(CART_STORAGE_KEY);
            if (typeof window.updateCart === 'function') window.updateCart();
        });
    }
});
