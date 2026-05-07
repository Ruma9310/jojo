// ============================================================
// PriceNest - Auth Page Logic
// ============================================================

var selectedRole = "user";

window.addEventListener("DOMContentLoaded", function() {
  // If already logged in, skip auth page
  if (localStorage.getItem("pn_loggedIn") === "true") {
    var role = localStorage.getItem("pn_role");
    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "home.html";
    }
    return;
  }
  // Check URL for signup tab
  var params = new URLSearchParams(window.location.search);
  if (params.get("tab") === "signup") {
    switchTab("signup");
  }
});

function selectRole(role, btn) {
  selectedRole = role;
  document.querySelectorAll(".role-btn").forEach(function(b) {
    b.classList.remove("selected");
  });
  btn.classList.add("selected");
}

function switchTab(tab) {
  var loginForm  = document.getElementById("loginForm");
  var signupForm = document.getElementById("signupForm");
  var tabLogin   = document.getElementById("tabLogin");
  var tabSignup  = document.getElementById("tabSignup");

  if (tab === "login") {
    loginForm.style.display  = "block";
    signupForm.style.display = "none";
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
  } else {
    loginForm.style.display  = "none";
    signupForm.style.display = "block";
    tabLogin.classList.remove("active");
    tabSignup.classList.add("active");
  }
}

async function handleLogin() {
  var email    = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showAlert("authAlert", "authAlertMsg", "Please fill in all fields.");
    return;
  }

  // Disable button to prevent double click
  var btn = document.querySelector("#loginForm .btn-primary");
  if (btn) { btn.disabled = true; btn.textContent = "Signing in..."; }

  try {
    var data = await apiCall("/login", "POST", {
      email: email,
      password: password,
      role: selectedRole
    });

    if (data.success) {
      // ✅ Save to localStorage - this is what makes the navbar work
      localStorage.setItem("pn_loggedIn", "true");
      localStorage.setItem("pn_username", data.username);
      localStorage.setItem("pn_role",     data.role);
      localStorage.setItem("pn_email",    email);

      var successEl  = document.getElementById("authSuccess");
      var successMsg = document.getElementById("authSuccessMsg");
      successEl.classList.add("show");
      successMsg.textContent = "✅ Welcome, " + data.username + "! Redirecting...";

      // Redirect based on role
      setTimeout(function() {
        if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "home.html";
        }
      }, 800);

    } else {
      if (btn) { btn.disabled = false; btn.textContent = "🔑 Sign In"; }
      showAlert("authAlert", "authAlertMsg", data.message || "Login failed. Check your credentials.");
    }

  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = "🔑 Sign In"; }
    showAlert("authAlert", "authAlertMsg", "Cannot connect to backend. Make sure Flask is running on port 5000.");
  }
}

async function handleSignup() {
  var username = document.getElementById("signupUsername").value.trim();
  var email    = document.getElementById("signupEmail").value.trim();
  var password = document.getElementById("signupPassword").value;

  if (!username || !email || !password) {
    showAlert("authAlert", "authAlertMsg", "Please fill in all fields.");
    return;
  }
  if (password.length < 6) {
    showAlert("authAlert", "authAlertMsg", "Password must be at least 6 characters.");
    return;
  }

  var btn = document.querySelector("#signupForm .btn-primary");
  if (btn) { btn.disabled = true; btn.textContent = "Creating account..."; }

  try {
    var data = await apiCall("/signup", "POST", {
      username: username,
      email: email,
      password: password,
      role: selectedRole
    });

    if (data.success) {
      var successEl  = document.getElementById("authSuccess");
      var successMsg = document.getElementById("authSuccessMsg");
      successEl.classList.add("show");
      successMsg.textContent = "✅ Account created! Please sign in.";
      setTimeout(function() { switchTab("login"); }, 1200);
    } else {
      if (btn) { btn.disabled = false; btn.textContent = "✨ Create Account"; }
      showAlert("authAlert", "authAlertMsg", data.message || "Signup failed.");
    }

  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = "✨ Create Account"; }
    showAlert("authAlert", "authAlertMsg", "Cannot connect to backend. Make sure Flask is running on port 5000.");
  }
}

// Enter key support
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    var signupForm = document.getElementById("signupForm");
    if (signupForm && signupForm.style.display === "block") {
      handleSignup();
    } else {
      handleLogin();
    }
  }
});
