async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = "Logging in...";

    const response = await apiRequest(getEndpoint('LOGIN'), {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      authenticated: false
    });

    saveAuth(response.token, email);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login failed: " + error.message);
    const btn = event.target;
    btn.disabled = false;
    btn.textContent = "Login";
  }
}

async function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = "Creating account...";

    await apiRequest(getEndpoint('SIGNUP'), {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      authenticated: false
    });

    alert("Account created successfully! Please login.");
    
    // Switch to login tab if exists, or redirect
    if (typeof showLogin === 'function') {
      showLogin();
    }
    
    btn.disabled = false;
    btn.textContent = "Sign Up";
  } catch (error) {
    alert("Signup failed: " + error.message);
    const btn = event.target;
    btn.disabled = false;
    btn.textContent = "Sign Up";
  }
}
