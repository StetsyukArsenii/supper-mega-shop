const API_URL = "https://suppermegashop-256e.restdb.io/rest/products";
const API_KEY = "695a7e097ba9c9203d7846b0";

const productsContainer = document.getElementById("products");
const cartBox = document.getElementById("cartBox");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const totalPriceEl = document.getElementById("totalPrice");
const ORDER_API = "https://suppermegashop-256e.restdb.io/rest/orders";


let cart = [];


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

    cart.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${item.name} — ${item.price} ₴
            <button class="remove" onclick="removeFromCart(${index})">❌</button>
        `;

        cartItems.appendChild(li);
        total += Number(item.price);
    });

    totalPriceEl.textContent = total;
}
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
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


const modal = document.getElementById("orderModal");
const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

document.querySelector(".buy").onclick = openModal;

function openModal() {
    if (cart.length === 0) return alert("Cart is empty");

    orderItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} — ${item.price} gold`;
        orderItems.appendChild(li);
        total += Number(item.price);
    });

    orderTotal.textContent = total;
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

async function sendOrder() {
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    if (!name || !address || !phone) {
        alert("Fill all fields");
        return;
    }

    let itemsText = "";
    let total = 0;

    cart.forEach(item => {
        itemsText += `- ${item.name} (${item.price} gold)\n`;
        total += Number(item.price);
    });

    
    alert(
        "ORDER DETAILS:\n\n" +
        "Name: " + name + "\n" +
        "Address: " + address + "\n" +
        "Phone: " + phone + "\n\n" +
        "Items:\n" + itemsText + "\n" +
        "Total: " + total + " gold"
    );

    
    const orderData = {
        name: name,
        address: address,
        phone: phone,
        items: cart.map(item => ({
            name: item.name,
            price: item.price
        })),
        total: total,
        status: "new"
    };

    try {
        const response = await fetch(
            "https://suppermegashop-256e.restdb.io/rest/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": API_KEY
                },
                body: JSON.stringify(orderData)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save order");
        }

        alert("Order saved successfully ✅");

        cart = [];
        renderCart();
        closeModal();

        document.getElementById("name").value = "";
        document.getElementById("address").value = "";
        document.getElementById("phone").value = "";

    } catch (error) {
        console.error(error);
        alert("Error saving order ❌");
    }
}







loadProducts();
