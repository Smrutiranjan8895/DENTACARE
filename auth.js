function getNextUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('next') || 'dashboard.html';
}

function handleAuthSuccess(tokens, email) {
  saveAuth(tokens, email);
  const next = getNextUrl();
  window.location.href = next;
}

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

    handleAuthSuccess(response, email);
  } catch (error) {
    alert("Login failed: " + error.message);
    const btn = event.target;
    btn.disabled = false;
    btn.textContent = "Login";
  }
}

async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
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

    const response = await apiRequest(getEndpoint('SIGNUP'), {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      authenticated: false
    });

    alert(response.message || "Signup successful. Please check your email for the verification code.");
    if (typeof showConfirm === 'function') {
      showConfirm(email);
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

async function confirmAccount() {
  const email = document.getElementById("confirmEmail").value;
  const code = document.getElementById("confirmCode").value;

  if (!email || !code) {
    alert("Please enter email and code");
    return;
  }

  try {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = "Verifying...";

    const response = await apiRequest(getEndpoint('CONFIRM'), {
      method: 'POST',
      body: JSON.stringify({ email, code }),
      authenticated: false
    });

    alert(response.message || "Email verified. Please log in.");
    if (typeof showLogin === 'function') {
      showLogin();
    }
    btn.disabled = false;
    btn.textContent = "Verify";
  } catch (error) {
    alert("Verification failed: " + error.message);
    const btn = event.target;
    btn.disabled = false;
    btn.textContent = "Verify";
  }
}
