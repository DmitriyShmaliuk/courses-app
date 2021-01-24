document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
  console.log(node.textContent);
  node.textContent = toDate(node.textContent);
});

M.Tabs.init(document.querySelector('.tabs'));

function toCurrency(number) {
  return new Intl.NumberFormat('en-EN', {
    currency: 'EUR',
    style: 'currency',
  }).format(number)
};

function toDate(date) {
  return new Intl.DateTimeFormat('en-EN', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
}

const $cart = document.querySelector('.cart-wrapper');

$cart.addEventListener('click', ({target}) => {
  const isDeleteButton = target.classList.contains('delete-btn');
  const { csrf } = target.dataset;

  const requestData = {
    method: 'delete',
    headers: { 'XSRF-TOKEN': csrf }
  };

  if (isDeleteButton) {
    fetch(`cart/remove/${target.dataset.id}`, requestData)
      .then(res => res.json())
      .then(cart => drawCart(cart, $cart));
  }
}, true);

function drawCart(cart, cartHTML) {
  if (!cart.courses.length) {
      cartHTML.innerHTML = '<p class="center">The cart is empty</p>'
  } else {
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

    const $tbody = cartHTML.querySelector('tbody');
    $tbody.innerHTML = html.join('');

    const $price = cartHTML.querySelector('.price');
    $price.innerHTML = toCurrency(cart.totalPrice);
  }
}
