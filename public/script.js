const productListElement = document.getElementById('product-list');
const productForm = document.getElementById('product-form');

async function loadProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    productListElement.innerHTML = '';
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'w3-col s4';
        productDiv.innerHTML = `
            <div class="w3-card">
                <div class="w3-container">
                    <h4>${product.name}</h4>
                    <p>Preço: R$ ${product.price}</p>
                    <button class="w3-button w3-red" onclick="removeProduct(${index})">Remover</button>
                </div>
            </div>
        `;
        productListElement.appendChild(productDiv);
    });
}

if (productForm) {
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });

        if (response.ok) {
            loadProducts();
        }
    });
}

async function removeProduct(index) {
    await fetch(`/api/products/${index}`, {
        method: 'DELETE'
    });
    loadProducts();
}

loadProducts();
