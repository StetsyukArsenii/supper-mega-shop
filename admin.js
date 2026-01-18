const API_URL = "https://suppermegashop-256e.restdb.io/rest/products";
const API_KEY = "695a7e097ba9c9203d7846b0";

const productsDiv = document.getElementById("products");

async function loadProducts() {
    const res = await fetch(API_URL, {
        headers: { "x-apikey": API_KEY }
    });
    const data = await res.json();

    productsDiv.innerHTML = "";

    data.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${p.photo_url}">
            <div>
                <b>${p.name}</b><br>
                ${p.price} gold
                <div class="actions">
                    <button onclick="deleteProduct('${p._id}')">Delete</button>
                </div>
            </div>
        `;

        productsDiv.appendChild(div);
    });
}

async function addProduct() {
    const product = {
        name: name.value,
        description: description.value,
        photo_url: photo_url.value,
        price: price.value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": API_KEY
        },
        body: JSON.stringify(product)
    });

    name.value = "";
    description.value = "";
    photo_url.value = "";
    price.value = "";

    loadProducts();
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        const response = await fetch(
            `https://suppermegashop-256e.restdb.io/rest/products/${id}`,
            {
                method: "DELETE",
                headers: {
                    "x-apikey": API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        loadProducts();
    } catch (err) {
        console.error(err);
        alert("❌ Product NOT deleted");
    }
}


loadProducts();
