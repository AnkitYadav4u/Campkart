const adsContainer = document.getElementById('ads-container');

const fetchAds = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/ads');
    const ads = await res.json();

    adsContainer.innerHTML = ads.map(ad => `
      <div class="ad-card">
        <h3>${ad.title}</h3>
        <p>${ad.description}</p>
        <p>Price: ₹${ad.price}</p>
        <p>Posted by: ${ad.user.name}</p>
        <a href="product.html?id=${ad._id}">View Details</a>
      </div>
    `).join('');
  } catch (error) {
    adsContainer.innerHTML = '<p>Failed to load ads.</p>';
    console.error(error);
  }
};

fetchAds();
