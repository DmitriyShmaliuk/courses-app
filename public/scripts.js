document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('uk-UK', {
        currency: 'EUR',
        style: 'currency',
    }).format(node.textContent);
});