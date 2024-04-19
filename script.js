console.log("Connected");

const men = document.getElementById("men");
const women = document.getElementById("women");
const kids = document.getElementById("kids");
const cardContainer = document.getElementById("cardContainer");



// Function to fetch data from the API
const fetchData = async () => {
    try {
        const url = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";
        const response = await fetch(url);
        const data = await response.json();

        console.log("Fetched Data:", data);  // Log fetched data

        if (data && Array.isArray(data.categories)) {
            return data.categories; // Return the categories array
        } else {
            throw new Error("Invalid data format");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data");
        return null;
    }
};

const calculateOfferPercentage = (sellingPrice, compareAtPrice) => {
    if (!sellingPrice || !compareAtPrice) {
        return 0;
    }

    const offer = ((compareAtPrice - sellingPrice) / compareAtPrice) * 100;
    return Math.round(offer);
};

// Function to render cards for a specific category
const renderCards = (products) => {
    cardContainer.innerHTML = ''; // Clear previous cards

    if (!products) {
        console.error("Invalid data format:", products);  // Log the invalid data
        return;
    }

    products.forEach((product) => {
        // Calculate offer percentage
        const offerPercentage = calculateOfferPercentage(product.price, product.compare_at_price);

        // Check if badge_text exists and create badge element
        const badge = product.badge_text ? `<div class="badge">${product.badge_text}</div>` : '';

        const card = `
        <div class="card" id="card${product.id}">
            ${badge} <!-- Badge container -->
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="flexClass">
                <div id="productTitle">${product.title}</div>
                <div id="vendor">${product.vendor}</div>
            </div>
            <div class="flexClass itemPrices">
                <div id="productPrice">${product.price}.00</div>
                <div id="compareAtPrice">${product.compare_at_price}.00</div>
                <div id="offer">${offerPercentage}%Off</div> <!-- Display offer percentage here -->
            </div>
            <button id="addToCart">Add to Cart</button>
        </div>
        `;
        cardContainer.innerHTML += card;
    });
};


// Event listeners to display data for selected category
const selectCategory = async (selectedElement, categoryName) => {
    // Remove active class from all categories
    [men, women, kids].forEach(element => {
        element.classList.remove("active");
    });

    // Add active class to selected category
    selectedElement.classList.add("active");

    const categories = await fetchData();
    if (categories) {
        const selectedData = categories.find(cat => cat.category_name.toLowerCase() === categoryName);
        renderCards(selectedData ? selectedData.category_products : []);
    }
};

men.addEventListener("click", async () => {
    await selectCategory(men, "men");
});

women.addEventListener("click", async () => {
    await selectCategory(women, "women");
});

kids.addEventListener("click", async () => {
    await selectCategory(kids, "kids");
});

// Default selection on page load
document.addEventListener("DOMContentLoaded", async () => {
    const categories = await fetchData();
    if (categories) {
        const womenData = categories.find(cat => cat.category_name.toLowerCase() === "women");
        renderCards(womenData ? womenData.category_products : []);
        women.classList.add("active"); // Add active class to Women by default
    }
});
