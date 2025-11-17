
const postAdForm = document.getElementById('postAd-form');
const message = document.getElementById('message');
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('images');
const preview = document.getElementById('preview');

// Read logged-in user & token from localStorage
const user = JSON.parse(localStorage.getItem('camkart_user'));
const token = localStorage.getItem('camkart_token');

// If not logged in, hide form and show warning
if (!user || !token) {
  message.style.color = 'red';
  message.textContent = '⚠️ You must be logged in to post an ad.';
  if (postAdForm) postAdForm.style.display = 'none';
} else {
  message.textContent = '';
}

let uploadedFiles = [];


dropArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  for (let file of files) {
    if (!file.type.startsWith('image/')) continue;

    uploadedFiles.push(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.marginRight = '5px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

postAdForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!user || !token) return;

  if (uploadedFiles.length === 0) {
    alert('Please upload at least one image!');
    return;
  }

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = document.getElementById('price').value.trim();

  message.style.color = 'black';
  message.textContent = 'Posting your ad...';

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('user_email', user.email); 
  uploadedFiles.forEach(file => formData.append('images[]', file));

  try {
    const res = await fetch('http://localhost/my_project/backend/index.php?route=ads&action=create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  
      },
      body: formData,
    });

    const raw = await res.text();
    console.log('RAW RESPONSE:', raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error('Backend did not return JSON');
    }

    if (data.status === 'success') {
      message.style.color = 'green';
      message.textContent = '✅ Ad posted successfully!';
      postAdForm.reset();
      preview.innerHTML = '';
      uploadedFiles = [];
      setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
      message.style.color = 'red';
      message.textContent = data.message || 'Failed to post ad.';
    }

  } catch (err) {
    console.error(err);
    message.style.color = 'red';
    message.textContent = 'Error connecting to server.';
  }
});

