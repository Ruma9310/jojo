// ============================================================
// PriceNest - History Page Logic
// ============================================================

var _historyData = []; // store full history for report linking

window.addEventListener("DOMContentLoaded", function() {
  var user = requireAuth(false);
  if (!user) return;
  updateNavbar(user);
  loadHistory(user.username);
});

async function loadHistory(username) {
  try {
    var res  = await fetch(API_BASE + "/history?username=" + encodeURIComponent(username), {
      headers: { "X-Username": username, "X-Role": localStorage.getItem("pn_role")||"user" }
    });
    var data = await res.json();
    document.getElementById("historyLoading").style.display = "none";

    if (!data.success || !data.history || data.history.length === 0) {
      document.getElementById("historyEmpty").style.display = "block";
      return;
    }
    renderHistoryCards(data.history);
  } catch(e) {
    document.getElementById("historyLoading").innerHTML =
      "<p style='color:var(--error);text-align:center;padding:2rem;'>❌ Cannot connect to backend. Run: python app.py</p>";
  }
}

// Convert USD to local currency string
function histToLocal(usdAmt, rate, symbol) {
  if (!rate || rate <= 1) return null;
  var local = usdAmt * rate;
  if (local >= 10000000)    return symbol + (local/10000000).toFixed(2) + " Cr";
  else if (local >= 100000) return symbol + (local/100000).toFixed(2) + " L";
  else                      return symbol + local.toLocaleString("en-US",{maximumFractionDigits:0});
}

// Show local first, USD below
function histPrice(usdAmt, rate, symbol, code) {
  var local = histToLocal(usdAmt, rate, symbol);
  if (!local || code === "USD") return symbol + Number(usdAmt).toLocaleString();
  return '<strong>' + local + '</strong><br><span style="font-size:11px;color:var(--gray-400);">($' + Number(usdAmt).toLocaleString() + ' USD)</span>';
}

function renderHistoryCards(history) {
  _historyData = history; // store for viewHistoryReport
  var container = document.getElementById("historyCards");
  container.style.display = "block";
  container.innerHTML = "";

  history.forEach(function(item, idx) {
    var rate     = parseFloat(item.currency_rate   || 1);
    var symbol   = item.currency_symbol || "$";
    var code     = item.currency_code   || "USD";
    _activeCurrencySymbol = symbol;
    var country  = item.country         || "";
    var inflation= item.inflation_rate  || null;
    var inflYear = item.inflation_year  || "";

    // Price in local
    var localPrice = histToLocal(item.best_price, rate, symbol);
    var adjUSD     = inflation ? item.best_price * (1 + inflation/100) : null;
    var localAdj   = adjUSD ? histToLocal(adjUSD, rate, symbol) : null;

    // Income in local
    var localIncome = histToLocal(item.income, rate, symbol);

    var card = document.createElement("div");
    card.style.cssText = "background:white;border-radius:14px;padding:22px;margin-bottom:18px;border:1px solid var(--lavender-200);box-shadow:0 2px 10px rgba(139,92,246,0.08);";

    card.innerHTML =
      // ---- Header ----
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:36px;height:36px;border-radius:50%;background:var(--lavender-500);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;">' + (idx+1) + '</div>' +
          '<div>' +
            '<div style="font-weight:700;font-size:15px;color:var(--lavender-700);">Prediction #' + (idx+1) + '</div>' +
            '<div style="font-size:12px;color:var(--gray-400);">📅 ' + formatDate(item.searched_at) + '</div>' +
          '</div>' +
        '</div>' +
        // Price — local first
        '<div style="text-align:right;">' +
          '<div style="font-size:22px;font-weight:800;color:var(--lavender-700);">' + (localPrice || formatPrice(item.best_price)) + '</div>' +
          (localPrice ? '<div style="font-size:11px;color:var(--gray-400);">(' + formatPrice(item.best_price) + ' USD)</div>' : '') +
          '<span style="background:var(--lavender-100);color:var(--lavender-700);padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-top:4px;display:inline-block;">🏆 ' + item.best_model + '</span>' +
        '</div>' +
      '</div>' +

      // ---- Property Details Grid ----
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;padding:14px;background:var(--lavender-100);border-radius:10px;margin-bottom:12px;">' +

        // Income — local first
        '<div>' +
          '<div style="font-size:11px;color:var(--gray-500);">💰 Income</div>' +
          (localIncome && code !== "USD"
            ? '<div style="font-weight:700;font-size:13px;color:var(--lavender-700);">' + localIncome + '</div>' +
              '<div style="font-size:11px;color:var(--gray-400);">($' + Number(item.income).toLocaleString() + ')</div>'
            : '<div style="font-weight:600;font-size:13px;">$' + Number(item.income).toLocaleString() + '</div>') +
        '</div>' +

        '<div><div style="font-size:11px;color:var(--gray-500);">📅 House Age</div><div style="font-weight:600;font-size:13px;">' + item.house_age + ' yrs</div></div>' +
        '<div><div style="font-size:11px;color:var(--gray-500);">🚪 Rooms</div><div style="font-weight:600;font-size:13px;">' + item.num_rooms + '</div></div>' +
        '<div><div style="font-size:11px;color:var(--gray-500);">🛏️ Bedrooms</div><div style="font-weight:600;font-size:13px;">' + item.num_bedrooms + '</div></div>' +
        '<div><div style="font-size:11px;color:var(--gray-500);">👥 Population</div><div style="font-weight:600;font-size:13px;">' + Number(item.population).toLocaleString() + '</div></div>' +
      '</div>' +

      // ---- Country / Currency / Inflation Badges ----
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">' +
        (country ? '<span style="background:#e0d4ff;color:var(--lavender-700);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;">🌍 ' + country + '</span>' : '<span style="background:#f3f4f6;color:var(--gray-500);padding:5px 12px;border-radius:20px;font-size:12px;">🌍 No country selected</span>') +
        (code !== "USD" ? '<span style="background:#e0d4ff;color:var(--lavender-700);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;">💱 1 USD = ' + rate + ' ' + code + '</span>' : '') +
        (inflation ? '<span style="background:#d1fae5;color:#065f46;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;">📈 Inflation: ' + inflation + '% (' + inflYear + ')</span>' : '<span style="background:#f3f4f6;color:var(--gray-500);padding:5px 12px;border-radius:20px;font-size:12px;">📈 No inflation applied</span>') +
        (localAdj ? '<span style="background:#d1fae5;color:#065f46;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;">🏠 Adj: ' + localAdj + '</span>' : '') +
      '</div>' +

      // ---- Actions ----
      '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
        '<a href="predict.html" class="btn btn-sm btn-outline" style="font-size:12px;">🔮 Predict Again</a>' +
        '<button onclick="viewHistoryReport(' + idx + ')" class="btn btn-sm btn-primary" style="font-size:12px;">📊 View Report</button>' +
      '</div>';

    container.appendChild(card);
  });
}

async function clearHistory() {
  if (!confirm("Clear ALL search history? This cannot be undone.")) return;
  var username = localStorage.getItem("pn_username");
  try {
    var res  = await fetch(API_BASE + "/history/clear", {
      method: "DELETE",
      headers: { "Content-Type":"application/json", "X-Username": username }
    });
    var data = await res.json();
    if (data.success) {
      showAlert("histAlert", "histAlertMsg", "✅ History cleared!", "success");
      document.getElementById("historyCards").style.display  = "none";
      document.getElementById("historyEmpty").style.display  = "block";
    }
  } catch(e) { alert("Error. Make sure backend is running."); }
}

function viewHistoryReport(idx) {
  var item = _historyData[idx];
  if (!item) return;

  // Build a pn_last_prediction object from this history record
  var predObj = {
    inputs: {
      income:      item.income,
      houseAge:    item.house_age,
      numRooms:    item.num_rooms,
      numBedrooms: item.num_bedrooms,
      population:  item.population
    },
    predictions:    item.predictions   || {},
    best_model:     item.best_model,
    best_price:     item.best_price,
    reason:         (item.best_model + " achieved the highest accuracy on this prediction."),
    country:        item.country        || "",
    currencyCode:   item.currency_code  || "USD",
    currencySymbol: item.currency_symbol|| "$",
    currencyRate:   parseFloat(item.currency_rate || 1),
    inflationRate:  item.inflation_rate || null,
    inflationYear:  item.inflation_year || "",
    timestamp:      item.searched_at
  };

  localStorage.setItem("pn_last_prediction", JSON.stringify(predObj));
  window.location.href = "report.html";
}
