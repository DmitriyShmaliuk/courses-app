document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

function toCurrency(number) {
    return new Intl.NumberFormat('uk-UK', {
        currency: 'EUR',
        style: 'currency',
    }).format(number)
}

const $cart = document.querySelector('.cart-wrapper');

$cart.addEventListener('click', ({target}) => {
    const isDeleteButton = target.classList.contains('delete-btn');

    if (isDeleteButton) {
        fetch(`cart/remove/${target.dataset.id}`, {
            method: 'delete',
        }).then(res => res.json())
          .then(cart => drawCart(cart, $cart));
    }
}, true);

function drawCart(cart, cartHTML) {
    if (!cart.courses.length) {
        cartHTML.innerHTML = '<p class="center">The cart is empty</p>'
    }
    else {
        const html = cart.courses.map(item => {
            return `
            <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
                <td>${item.price}</td>
                <td>
                    <button class="btn btn-primary delete-btn" data-id="${item.id}">Delete</button>
                </td>
            </tr>`;
        });

        console.log(html);

        const $tbody = cartHTML.querySelector('tbody');
        $tbody.innerHTML = html.join('');

        const $price = cartHTML.querySelector('.price');
        $price.innerHTML = toCurrency(cart.price);
    }
}