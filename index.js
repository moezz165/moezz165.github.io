
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const popup = document.getElementById("popup");

    function showPopup() {
      popup.classList.add("show");
      setTimeout(() => popup.classList.remove("show"), 2000);
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseInt(button.getAttribute("data-price"));
        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
        showPopup();
      });
    });
