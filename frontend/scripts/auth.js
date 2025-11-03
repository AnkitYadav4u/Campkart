const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Save token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      message.style.color = 'green';
      message.textContent = 'Login successful! Redirecting...';
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    } else {
      message.style.color = 'red';
      message.textContent = data.message || 'Login failed';
    }
  } catch (error) {
    message.style.color = 'red';
    message.textContent = 'Error logging in';
    console.error(error);
  }
});
