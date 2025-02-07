document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartTotal = document.getElementById("cart-total");

    const API_URL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.items.length === 0) {
                cartItemsContainer.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
                return;
            }

            let subtotal = 0;

            data.items.forEach(item => {
                const cartRow = document.createElement("tr");

                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                cartRow.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.product_title}">
                        ${item.product_title}
                    </td>
                    <td>Rs. ${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                    </td>
                    <td>Rs. ${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="remove-item" data-id="${item.id}">🗑️</button>
                    </td>
                `;

                cartItemsContainer.appendChild(cartRow);
            });

            cartSubtotal.innerText = `Rs. ${subtotal.toFixed(2)}`;
            cartTotal.innerText = `Rs. ${subtotal.toFixed(2)}`;

            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener("click", function() {
                    const itemId = this.getAttribute("data-id");
                    removeItem(itemId);
                });
            });

            document.querySelectorAll(".quantity-input").forEach(input => {
                input.addEventListener("change", function() {
                    const itemId = this.getAttribute("data-id");
                    const newQuantity = parseInt(this.value);
                    updateQuantity(itemId, newQuantity);
                });
            });
        })
        .catch(error => {
            cartItemsContainer.innerHTML = "<tr><td colspan='5'>Failed to load cart data.</td></tr>";
            console.error(error);
        });

    function removeItem(itemId) {
        document.querySelector(`[data-id="${itemId}"]`).closest("tr").remove();
        recalculateTotal();
    }

    function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) {
            removeItem(itemId);
        } else {
            recalculateTotal();
        }
    }

    function recalculateTotal() {
        let newSubtotal = 0;

        document.querySelectorAll(".quantity-input").forEach(input => {
            const price = parseFloat(input.closest("tr").querySelector("td:nth-child(2)").innerText.replace("Rs. ", ""));
            const quantity = parseInt(input.value);
            const newItemTotal = price * quantity;
            input.closest("tr").querySelector("td:nth-child(4)").innerText = `Rs. ${newItemTotal.toFixed(2)}`;
            newSubtotal += newItemTotal;
        });

        cartSubtotal.innerText = `Rs. ${newSubtotal.toFixed(2)}`;
        cartTotal.innerText = `Rs. ${newSubtotal.toFixed(2)}`;
    }
});
