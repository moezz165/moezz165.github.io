document.addEventListener("DOMContentLoaded", function() {
    const payForm = document.getElementById("payForm");
    const popupOverlay = document.getElementById("popup");
    const popupMessage = popupOverlay.querySelector("h3");
    const emailInput = document.querySelector('input[name="email"]');
    
    const paymentMethodInputs = document.querySelectorAll('input[name="payment_method"]');
    const cardFields = document.getElementById('cardFields');
    const payButton = document.querySelector('#payForm button[type="submit"]');

    function updatePaymentView() {
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
        
        if (selectedMethod === 'card') {
            cardFields.style.display = 'block';
            payButton.textContent = 'Betala med kort';
        } else {
            cardFields.style.display = 'none';

            switch (selectedMethod) {
                case 'applepay':
                    payButton.textContent = 'Gå till Apple Pay';
                    break;
                case 'paypal':
                    payButton.textContent = 'Gå till PayPal';
                    break;
                case 'klarna':
                    payButton.textContent = 'Gå till Klarna';
                    break;
                default:
                    payButton.textContent = 'Betala';
            }
        }
    }

    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', updatePaymentView);
    });

    updatePaymentView(); 

    if (payForm) {
        payForm.addEventListener("submit", function (e) {
            e.preventDefault();

            localStorage.clear();
  
            if (window.updateCart) {
                window.updateCart(); 
            }

            const email = emailInput.value;
            popupMessage.innerHTML = 
                "Tack för ditt köp!<br>En bekräftelse har skickats till " + email;

            setTimeout(() => {
                popupOverlay.style.display = "flex"; 
            }, 50);
        });
    }
});