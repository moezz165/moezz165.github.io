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

    function parsePrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, ''), 10);
    }
    function showPopup(message, className) {
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
            setTimeout(() => {
                overlay.remove();
            }, 300); 
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn) {
                removePopup();
            }
        });
        setTimeout(removePopup, 3000);
    }
    const laggtillKnapp = document.querySelector('.btn-laggtill');

    if (laggtillKnapp) {
        const fargKnappar = document.querySelectorAll('.farg-knapp');
        const storlekKnappar = document.querySelectorAll('.storlek-knapp:not(:disabled)');
        const valdFargSpan = document.getElementById('vald-farg');
        const produktTitel = document.querySelector('.produkt-titel').textContent.trim();
        const produktPrisText = document.querySelector('.produkt-pris').textContent.trim();
        const huvudbild = document.querySelector('.huvudbild');

        let valdFarg = valdFargSpan?.textContent.trim() || 'Svart';
        let valdStorlek = document.querySelector('.storlek-knapp.aktiv')?.textContent.trim() || 'M';
        const produktPris = parsePrice(produktPrisText);
        const produktBild = huvudbild?.getAttribute('src');

        fargKnappar.forEach(knapp => {
            knapp.addEventListener('click', () => {
                fargKnappar.forEach(k => k.classList.remove('aktiv'));
                knapp.classList.add('aktiv');
                valdFarg = knapp.getAttribute('data-farg');
                valdFargSpan.textContent = valdFarg;
                const nyBildSrc = `hoodie${valdFarg.toLowerCase()}-600.WebP`;
                if (huvudbild) {
                    huvudbild.setAttribute('src', nyBildSrc);
                    huvudbild.setAttribute('alt', `${produktTitel} ${valdFarg}`);
                }
            });
        });

        storlekKnappar.forEach(knapp => {
            knapp.addEventListener('click', () => {
                storlekKnappar.forEach(k => k.classList.remove('aktiv'));
                knapp.classList.add('aktiv');
                valdStorlek = knapp.textContent.trim();
            });
        });

        laggtillKnapp.addEventListener('click', () => {
            if (!valdFarg || !valdStorlek) {
                alert("Vänligen välj både färg och storlek.");
                return;
            }
            
            const cart = getCart();
            const produktId = `${produktTitel}-${valdFarg}-${valdStorlek}`;
            const befintligArtikel = cart.find(item => item.id.includes(produktTitel) && item.color === valdFarg && item.size === valdStorlek);

            if (befintligArtikel) {
                befintligArtikel.quantity += 1;
            } else {
                const nyArtikel = {
                    id: produktId, 
                    name: produktTitel,
                    color: valdFarg,
                    size: valdStorlek,
                    price: produktPris,
                    image: produktBild,
                    quantity: 1
                };
                cart.push(nyArtikel);
            }

            saveCart(cart);

            showPopup(`🎉 Lades till i kundvagnen:<br><b>${produktTitel}</b><br>(${valdFarg}, ${valdStorlek})`, 'produkt-köpt');
        });
        if (!document.querySelector('.storlek-knapp.aktiv') && storlekKnappar.length > 0) {
            const defaultButton = Array.from(storlekKnappar).find(b => b.textContent.trim() === 'M') || storlekKnappar[0];
            defaultButton.classList.add('aktiv');
            valdStorlek = defaultButton.textContent.trim();
        }
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

            showPopup(` Lades till i kundvagnen:<br><b>${productTitle}</b><br>(${color}, ${size})`, 'produkt-köpt');
        });
    });
});