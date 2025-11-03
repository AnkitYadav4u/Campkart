const adDetailsContainer = document.getElementById('ad-details');

// Get ad ID from URL
const params = new URLSearchParams(window.location.search);
const adId = params.get('id');

const fetchAd = async () => {
  if (!adId) {
    adDetailsContainer.innerHTML = '<p>Invalid ad ID.</p>';
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/ads/${adId}`);
    const ad = await res.json();

    if (res.ok) {
      adDetailsContainer.innerHTML = `
        <h2>${ad.title}</h2>
        <p>${ad.description}</p>
        <p>Price: ₹${ad.price}</p>
        <p>Posted by: ${ad.user.name} (${ad.user.email})</p>
        ${ad.images.length ? `<h3>Images:</h3>
        <div>
          ${ad.images.map(img => `<img src="${img}" alt="${ad.title}" style="max-width:200px; margin:5px;">`).join('')}
        </div>` : ''}
      `;
    } else {
      adDetailsContainer.innerHTML = `<p>${ad.message || 'Ad not found.'}</p>`;
    }
  } catch (error) {
    adDetailsContainer.innerHTML = '<p>Error loading ad.</p>';
    console.error(error);
  }
};

fetchAd();
