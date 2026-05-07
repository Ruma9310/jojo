var API_BASE = "http://localhost:5000/api";

async function apiCall(endpoint, method, body) {
  method = method || "GET";
  var username = localStorage.getItem("pn_username") || "";
  var role     = localStorage.getItem("pn_role")     || "user";
  var email    = localStorage.getItem("pn_email")    || "";

  var headers = {
    "Content-Type": "application/json",
    "X-Username": username,
    "X-Role":     role,
    "X-Email":    email
  };

  // Inject username into body so backend receives it no matter what
  var finalBody = {};
  if (body) { for (var k in body) finalBody[k] = body[k]; }
  if (username) {
    finalBody.username = username;
    finalBody.role     = role;
    finalBody.email    = email;
  }

  var options = { method: method, headers: headers };
  if (method !== "GET" && method !== "DELETE") {
    options.body = JSON.stringify(finalBody);
  }

  var res  = await fetch(API_BASE + endpoint, options);
  var data = await res.json();
  return data;
}

// Each page sets this to its active currency symbol so formatPrice() always uses the right one
var _activeCurrencySymbol = "$";

function formatPrice(num, symbol) {
  var s = symbol || _activeCurrencySymbol || "$";
  return s + Number(num).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleString("en-US", { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

function showAlert(elId, msgId, msg, type) {
  type = type || "error";
  var el = document.getElementById(elId);
  var msgEl = document.getElementById(msgId);
  if (!el || !msgEl) return;
  el.className = "alert alert-" + type + " show";
  msgEl.textContent = msg;
  setTimeout(function() { el.className = "alert alert-" + type; }, 5000);
}

function goToProfile() {
  alert("👤 Profile\n\nUsername : " + (localStorage.getItem("pn_username")||"—") + "\nEmail    : " + (localStorage.getItem("pn_email")||"—") + "\nRole     : " + (localStorage.getItem("pn_role")||"—"));
}

async function logout() {
  try { await apiCall("/logout","POST",{ email: localStorage.getItem("pn_email")||"" }); } catch(e) {}
  localStorage.clear();
  window.location.href = "home.html";
}

function updateNavbar(user) {
  document.querySelectorAll("#navUsername").forEach(function(el) { el.textContent = "👋 " + user.username; });
  var adminLink = document.getElementById("navAdmin");
  if (adminLink && user.role === "admin") adminLink.style.display = "list-item";
  ["navPredict","navHistory","navReport"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "list-item";
  });
  var navGuest    = document.getElementById("navGuest");
  var navLoggedIn = document.getElementById("navLoggedIn");
  if (navGuest)    navGuest.style.display    = "none";
  if (navLoggedIn) navLoggedIn.style.display = "flex";
}

function requireAuth(adminOnly) {
  adminOnly = adminOnly || false;
  var username = localStorage.getItem("pn_username");
  var role     = localStorage.getItem("pn_role");
  var loggedIn = localStorage.getItem("pn_loggedIn");
  if (!loggedIn || !username) { window.location.href = "auth.html"; return null; }
  if (adminOnly && role !== "admin") { alert("⛔ Admin access only!"); window.location.href = "home.html"; return null; }
  return { username: username, role: role, email: localStorage.getItem("pn_email")||"" };
}

function checkLoginStatus() {
  var username = localStorage.getItem("pn_username");
  var loggedIn = localStorage.getItem("pn_loggedIn");
  var role     = localStorage.getItem("pn_role");
  if (loggedIn === "true" && username) {
    updateNavbar({ username: username, role: role||"user" });
    var heroBtns       = document.getElementById("heroBtns");
    var heroPredictBtn = document.getElementById("heroPredictBtn");
    var ctaBtns        = document.getElementById("ctaBtns");
    var ctaPredictBtn  = document.getElementById("ctaPredictBtn");
    if (heroBtns)       heroBtns.style.display      = "none";
    if (heroPredictBtn) heroPredictBtn.style.display = "block";
    if (ctaBtns)        ctaBtns.style.display        = "none";
    if (ctaPredictBtn)  ctaPredictBtn.style.display  = "block";
  }
}
