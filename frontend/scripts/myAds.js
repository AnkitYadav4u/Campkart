// API URLs pointing to index.php router
const API_USER = "http://localhost/Campkart/backend/index.php?route=users";
const API_ADS  = "http://localhost/Campkart/backend/index.php?route=ads";
const API_BASE = "http://localhost/Campkart/backend";

const user = JSON.parse(localStorage.getItem("camkart_user"));
if (!user) window.location.href = "login.html";

// ----- Load User Details ---
async function loadUserDetails() {
  try {
    const res = await fetch(`${API_USER}&action=user_details&user_email=${user.email}`);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    if (data.status === "success") {
        const u = data.user;
        document.getElementById("user-details").innerHTML = `
            <p><strong>Name:</strong> ${u.name}</p>
            <p><strong>Email:</strong> ${u.email}</p>
        `;
    } else {
        document.getElementById("user-details").innerHTML = `<p>${data.message}</p>`;
    }
  } catch(err) {
    console.error("Error fetching user details:", err);
    document.getElementById("user-details").innerHTML = "<p>Error loading user details</p>";
  }
}

// -- Load User Ads ------
async function loadMyAds() {
    try {
        const res = await fetch(`${API_ADS}&action=my_ads&user_email=${user.email}`);
        if (!res.ok) throw new Error("Network error");
        const ads = await res.json();
        const container = document.getElementById("my-ads-container");

        if (!ads || ads.length === 0) {
            container.innerHTML = "<p>No ads posted yet.</p>";
            return;
        }

        container.innerHTML = ads.map(ad => `
            <div class="ad-card">
                <div class="ad-image-container">
                    ${ad.images.map(img => `<img class="ad-image" src="${API_BASE}/${img}" alt="${ad.title}">`).join('')}
                </div>
                <div class="ad-info">
                    <h3>${ad.title}</h3>
                    <h4>₹${ad.price}</h4>
                    <p>${ad.description}</p>
                </div>
                <button class="delete-btn" onclick="deleteAd(${ad.id})">Delete</button>
            </div>
        `).join('');

        // Add click event for images to open modal
        const images = document.querySelectorAll('.ad-image');
        images.forEach(img => {
            img.addEventListener('click', () => openModal(img.src));
        });

    } catch(err) {
        console.error("Error fetching user ads:", err);
        document.getElementById("my-ads-container").innerHTML = "<p>Error loading ads</p>";
    }
}

// -- Delete Ad -----
async function deleteAd(adId) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
        const formData = new FormData();
        formData.append("ad_id", adId);
        formData.append("user_email", user.email);

        const res = await fetch(`${API_ADS}&action=delete`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Network error");

        const data = await res.json();
        alert(data.message);
        loadMyAds();
    } catch(err) {
        console.error("Error deleting ad:", err);
        alert("Failed to delete ad");
    }
}

// ------ Modal Logic ------
function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = "block";
    modalImg.src = src;
}

function closeModal() {
    document.getElementById('imageModal').style.display = "none";
}

// Close modal on click of X
document.querySelector('.close').addEventListener('click', closeModal);

// Close modal on clicking outside image
window.addEventListener('click', (e) => {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) closeModal();
});

// --------- Init -------
document.addEventListener("DOMContentLoaded", () => {
    loadUserDetails();
    loadMyAds();
});

