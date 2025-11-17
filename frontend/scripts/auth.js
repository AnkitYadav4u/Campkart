// CamKart Authentication Logic 

// Auto-detect backend path
const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost/my_project/backend"
  : "./backend";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const message = document.getElementById("message");

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: signupForm.name.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
      };

      try {
        const response = await fetch(`${API_BASE}/index.php?route=users&action=register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const raw = await response.text();
        console.log("SIGNUP RAW RESPONSE:", raw);

        let json;
        try {
          json = JSON.parse(raw);
        } catch {
          throw new Error("Backend did not return JSON");
        }

        if (json.status === "success") {
          message.textContent = "Signup successful. Redirecting to login...";
          message.style.color = "green";

          setTimeout(() => {
            window.location.href = "login.html";
          }, 1200);
        } else {
          message.textContent = json.message || "Signup failed";
          message.style.color = "red";
        }

      } catch (err) {
        console.error(err);
        message.textContent = "Error connecting to server.";
        message.style.color = "red";
      }
    });
  }

  // LOGIN=
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value,
      };

      try {
        const response = await fetch(`${API_BASE}/index.php?route=users&action=login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const raw = await response.text();
        console.log("LOGIN RAW RESPONSE:", raw);

        let json;
        try {
          json = JSON.parse(raw);
        } catch {
          throw new Error("Backend did not return JSON");
        }

        if (json.status === "success") {
          // Save token & user
          localStorage.setItem("camkart_token", json.token);
          localStorage.setItem("camkart_user", JSON.stringify(json.user));

          message.textContent = "Login successful! Redirecting...";
          message.style.color = "green";

          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);

        } else {
          message.textContent = json.message || "Login failed";
          message.style.color = "red";
        }

      } catch (err) {
        console.error(err);
        message.textContent = "Error connecting to server.";
        message.style.color = "red";
      }
    });
  }
});

