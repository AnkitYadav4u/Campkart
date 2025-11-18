const API_BASE = "http://localhost/Campkart/backend";
const container = document.getElementById("ads-container");
const searchInput = document.getElementById("searchInput");

let allAds = [];
let searchTimeout = null;

// Load all ads initially
async function loadAds() {
    try {
        const response = await fetch(`${API_BASE}/index.php?route=ads&action=list`);
        if (!response.ok) throw new Error("Network response was not ok");

        allAds = await response.json();
        displayAds(allAds);
    } catch (err) {
        console.error("Error fetching ads:", err);
        container.innerHTML = "<p>Failed to load ads</p>";
    }
}

// Display ads function
function displayAds(adsList) {
    container.innerHTML = "";
    if (!adsList.length) {
        container.innerHTML = "<p>No ads found</p>";
        return;
    }

    adsList.forEach(ad => {
        const adDiv = document.createElement("div");
        adDiv.className = "ad-card";

        let imgHTML = "";
        if (ad.images && ad.images.length) {
            imgHTML = ad.images.map(img => 
                `<img src="${API_BASE}/${encodeURI(img)}" alt="ad image" width="150">`
            ).join('');
        }

        adDiv.innerHTML = `
            <div class="ad-images">${imgHTML}</div>
            <div class="card__content">
                <div class="card__conent-gap">
                    <h3>${ad.title}</h3>
                    <h2>₹${ad.price}</h2>
                </div>
                <p>${ad.description}</p>
                <h5>Posted by: ${ad.user_email}</h5>
            </div>
        `;
        container.appendChild(adDiv);
    });
}

// Live search function with debounce
async function searchAds(query) {
    if (!query) {
        displayAds(allAds); // show all ads if query empty
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/index.php?route=ads&action=search&query=${encodeURIComponent(query)}`);
        const ads = await response.json();
        displayAds(ads);
    } catch (error) {
        console.error("Search failed:", error);
    }
}

// Event listener for instant search
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchAds(searchInput.value.trim());
    }, 300); // 300ms debounce
});

// Load ads on page load
document.addEventListener("DOMContentLoaded", loadAds);

