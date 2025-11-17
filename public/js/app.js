async function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;

    try {
        const response = await fetch('/cart/count');
        const data = await response.json();

        if (data.success) {
            cartCountElement.textContent = data.count;
        } else {
            cartCountElement.textContent = 0;
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
        cartCountElement.textContent = 0;
    }
}


// Run on page load
updateCartCount();


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.dataset.productId;
        console.log('Adding product to cart:', productId);

        try {
            button.disabled = true;

            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                accept: 'application/json',
                body: JSON.stringify({ productId })
            });

            const data = await response.json();

            if (data.success) {
                alert('Product added to cart!');
                updateCartCount();
                // Optional: Update cart counter
                // document.getElementById('cart-count').innerText = data.cart.length;
            } else {
                alert('Could not add product to cart.');
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred. Please try again.');
        } finally {
            button.disabled = false;
        }
    });
});