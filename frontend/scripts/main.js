const API_BASE = "http://localhost/my_project/backend"; 
const container = document.getElementById("ads-container");

async function loadAds() {
    try {
        // Fetch all ads from backend
        const response = await fetch(`${API_BASE}/index.php?route=ads&action=list`);
        if (!response.ok) throw new Error("Network response was not ok");

        const ads = await response.json(); // parse JSON directly
        container.innerHTML = ""; 

        if (!ads.length) {
            container.innerHTML = "<p>No ads available</p>";
            return;
        }

        // Render each ad
        ads.forEach(ad => {
            const adDiv = document.createElement("div");
            adDiv.className = "ad-card";

            // Render all images with proper encoding
            let imgHTML = "";
            if (ad.images && ad.images.length) {
                imgHTML = ad.images.map(img => 
                    `<img src="${API_BASE}/${encodeURI(img)}" alt="ad image" width="150">`
                ).join('');
            }

            adDiv.innerHTML = `
                <div class="ad-images">
                ${imgHTML}
                <p class="featured">featured</p>
                </div>
                <div class="card__content">
                <div class="card__conent-gap">
                <h3>${ad.title}</h3>
                <h2>Price: ₹${ad.price}</h2>
                </div>
                <p>${ad.description}</p>
                <h5>Posted by: ${ad.user_email}</h5>
                </div>
            `;
            container.appendChild(adDiv);
        });

    } catch (err) {
        console.error("Error fetching ads:", err);
        container.innerHTML = "<p>Failed to load ads</p>";
    }
}

// Load ads when page is ready
document.addEventListener("DOMContentLoaded", loadAds);

