const API_URL = "https://suppermegashop-256e.restdb.io/rest/products";
const API_KEY = "695a7e097ba9c9203d7846b0";

const productsContainer = document.getElementById("products");
const cartBox = document.getElementById("cartBox");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const totalPriceEl = document.getElementById("totalPrice");

let cart = [];

/* ===== CART ===== */
function toggleCart() {
    cartBox.style.display =
        cartBox.style.display === "block" ? "none" : "block";
}

function addToCart(product) {
    cart.push(product);
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartEmpty.style.display = "block";
    } else {
        cartEmpty.style.display = "none";
    }

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} — ${item.price} ₴`;
        cartItems.appendChild(li);
        total += Number(item.price);
    });

    totalPriceEl.textContent = total;
}


async function loadProducts() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                "x-apikey": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("API error: " + response.status);
        }

        const products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product";

            card.innerHTML = `
                <img src="${product.photo_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><b>${product.price} gold</b></p>
                <button>Add to cart</button>
            `;

            card.querySelector("button").onclick = () =>
                addToCart(product);

            productsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        productsContainer.innerHTML =
            "<p style='color:red'> Failed to load products</p>";
    }
}

loadProducts();
