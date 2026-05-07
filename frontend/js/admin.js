// ============================================================
// PriceNest - Admin Dashboard Logic
// ============================================================

window.addEventListener("DOMContentLoaded", function() {
  var user = requireAuth(true);
  if (!user) return;
  document.getElementById("adminName").textContent = user.username;
  document.getElementById("statDate").textContent = new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  loadDashboard(user.role);
});

async function loadDashboard(role) {
  try {
    var res  = await fetch(API_BASE + "/admin/dashboard?role=" + role, {
      headers: { "X-Username": localStorage.getItem("pn_username"), "X-Role": role }
    });
    var data = await res.json();
    if (!data.success) { showError("Not authorized or server error."); return; }

    document.getElementById("statTotalUsers").textContent    = data.total_users;
    document.getElementById("statActiveUsers").textContent   = data.active_users;
    document.getElementById("statTotalSearches").textContent = data.total_searches;

    renderActiveUsers(data.active_user_list);
    renderAllUsers(data.all_users);
    renderSearchActivity(data.recent_searches);
  } catch(e) {
    showError("Cannot connect to backend. Run: python app.py");
  }
}

function renderActiveUsers(users) {
  var c = document.getElementById("activeUsersContainer");
  if (!users || users.length === 0) {
    c.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--gray-400);"><div style="font-size:40px;">😴</div><p>No active users.</p></div>';
    return;
  }
  c.innerHTML = users.map(function(u) {
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--lavender-100);border-radius:var(--radius-sm);margin-bottom:8px;">' +
      '<div style="width:36px;height:36px;border-radius:50%;background:var(--lavender-400);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">' + u.username.charAt(0).toUpperCase() + '</div>' +
      '<div><div style="font-weight:600;font-size:14px;color:var(--lavender-700);">' + u.username + '</div><div style="font-size:12px;color:var(--gray-500);">' + u.email + '</div></div>' +
      '<span style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:var(--success);display:inline-block;"></span></div>';
  }).join("");
}

function renderAllUsers(users) {
  var c = document.getElementById("allUsersContainer");
  if (!users || users.length === 0) { c.innerHTML = '<p style="color:var(--gray-400);padding:1rem;text-align:center;">No users yet.</p>'; return; }
  c.innerHTML = '<div class="table-wrap"><table><thead><tr><th>#</th><th>👤 Username</th><th>📧 Email</th><th>📅 Joined</th></tr></thead><tbody>' +
    users.map(function(u, i) {
      return '<tr><td>' + (i+1) + '</td><td style="font-weight:600;">' + u.username + '</td><td>' + u.email + '</td><td style="font-size:13px;">' + formatDate(u.created_at) + '</td></tr>';
    }).join("") + '</tbody></table></div>';
}

// Convert USD to local
function adminToLocal(usdAmt, rate, symbol) {
  if (!rate || rate <= 1) return null;
  var local = usdAmt * rate;
  if (local >= 10000000)    return symbol + (local/10000000).toFixed(2) + " Cr";
  else if (local >= 100000) return symbol + (local/100000).toFixed(2) + " L";
  else                      return symbol + local.toLocaleString("en-US",{maximumFractionDigits:0});
}

function renderSearchActivity(searches) {
  var c = document.getElementById("searchActivityContainer");
  if (!searches || searches.length === 0) {
    c.innerHTML = '<p style="color:var(--gray-400);padding:1rem;text-align:center;">No searches yet.</p>';
    return;
  }

  c.innerHTML =
    '<div class="table-wrap"><table>' +
    '<thead><tr>' +
      '<th>#</th>' +
      '<th>👤 User</th>' +
      '<th>📅 Date</th>' +
      '<th>💰 Income</th>' +
      '<th>🚪 Rooms</th>' +
      '<th>🛏️ Bedrooms</th>' +
      '<th>🌍 Country</th>' +
      '<th>📈 Inflation</th>' +
      '<th>🏆 Best Model</th>' +
      '<th>💵 Price</th>' +
    '</tr></thead><tbody>' +

    searches.map(function(s, i) {
      var rate     = parseFloat(s.currency_rate   || 1);
      var symbol   = s.currency_symbol || "$";
      var code     = s.currency_code   || "USD";
      var country  = s.country         || "—";
      var inflation= s.inflation_rate  || null;
      var inflYear = s.inflation_year  || "";

      var localIncome = adminToLocal(s.income, rate, symbol);
      var localPrice  = adminToLocal(s.best_price, rate, symbol);

      return '<tr>' +
        '<td>' + (i+1) + '</td>' +
        '<td style="font-weight:600;">' + s.username + '</td>' +
        '<td style="font-size:12px;">' + formatDate(s.searched_at) + '</td>' +

        // Income — local first
        '<td>' +
          (localIncome && code !== "USD"
            ? '<strong style="color:var(--lavender-700);">' + localIncome + '</strong><br><span style="font-size:11px;color:var(--gray-400);">($' + Number(s.income).toLocaleString() + ' USD)</span>'
            : '<span style="color:var(--gray-500);">$' + Number(s.income).toLocaleString() + '</span>') +
        '</td>' +

        '<td>' + s.num_rooms + '</td>' +
        '<td>' + s.num_bedrooms + '</td>' +

        // Country + currency
        '<td>' +
          (country !== "—"
            ? '<span style="font-weight:600;color:var(--lavender-700);">' + country + '</span>' +
              (code !== "USD" ? '<br><span style="font-size:11px;color:var(--gray-400);">' + code + '</span>' : '')
            : '<span style="color:var(--gray-400);">—</span>') +
        '</td>' +

        // Inflation
        '<td>' +
          (inflation
            ? '<span style="color:#065f46;font-weight:600;">' + inflation + '%</span>' +
              '<br><span style="font-size:11px;color:var(--gray-400);">(' + inflYear + ')</span>'
            : '<span style="color:var(--gray-400);">—</span>') +
        '</td>' +

        '<td><span class="badge badge-purple">' + s.best_model + '</span></td>' +

        // Price — local first
        '<td>' +
          (localPrice && code !== "USD"
            ? '<strong style="color:var(--lavender-700);">' + localPrice + '</strong><br><span style="font-size:11px;color:var(--gray-400);">(' + formatPrice(s.best_price) + ')</span>'
            : '<strong style="color:var(--lavender-700);">' + formatPrice(s.best_price) + '</strong>') +
        '</td>' +

        '</tr>';
    }).join("") +
    '</tbody></table></div>';
}

function showError(msg) {
  ["activeUsersContainer","allUsersContainer","searchActivityContainer"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<p style="color:var(--error);padding:1rem;">' + msg + '</p>';
  });
}
