const postAdForm = document.getElementById('postAd-form');
const message = document.getElementById('message');

// Get token from localStorage
const token = localStorage.getItem('token');

if (!token) {
  message.style.color = 'red';
  message.textContent = 'You must be logged in to post an ad.';
  postAdForm.style.display = 'none';
}

postAdForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const images = document.getElementById('images').value
    .split(',')
    .map(img => img.trim())
    .filter(img => img !== '');

  try {
    const res = await fetch('http://localhost:5000/api/ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, price, images })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = 'green';
      message.textContent = 'Ad posted successfully!';
      postAdForm.reset();
    } else {
      message.style.color = 'red';
      message.textContent = data.message || 'Failed to post ad';
    }
  } catch (error) {
    message.style.color = 'red';
    message.textContent = 'Error posting ad';
    console.error(error);
  }
});