// ============================================================
// PriceNest - Report Page Logic
// ============================================================

var ALGO_DESCRIPTIONS = {
  "Linear Regression":  { emoji:"📈", desc:"Finds the best-fit line through data. Simple, fast, and easy to interpret." },
  "Decision Tree":      { emoji:"🌳", desc:"Splits data into branches like a flowchart. Models non-linear relationships." },
  "Random Forest":      { emoji:"🌲", desc:"Builds hundreds of decision trees and averages results. Very accurate." },
  "Gradient Boosting":  { emoji:"🚀", desc:"Builds models sequentially, each correcting the previous. Often the best." }
};
var MEDALS = ["🥇","🥈","🥉","4️⃣"];

var repCurrencyCode   = "USD";
var repCurrencySymbol = "$";
var repCurrencyRate   = 1;
var repCountry        = "";
var repInflation      = null;
var repInflationYear  = "";

window.addEventListener("DOMContentLoaded", function() {
  var user = requireAuth(false);
  if (!user) return;
  updateNavbar(user);
  document.getElementById("reportDate").textContent =
    "Generated: " + new Date().toLocaleString("en-US",{dateStyle:"full",timeStyle:"short"});

  var lastPred = localStorage.getItem("pn_last_prediction");
  if (lastPred) {
    try {
      var p = JSON.parse(lastPred);
      repCurrencyCode   = p.currencyCode   || "USD";
      repCurrencySymbol = p.currencySymbol || "$";
      repCurrencyRate   = p.currencyRate   || 1;
      repCountry        = p.country        || "";
      repInflation      = p.inflationRate  || null;
      repInflationYear  = p.inflationYear  || "";
    } catch(e) {}
  }
  loadReport();
});

// Local currency (primary), USD (secondary)
function toRepLocal(usdAmt) {
  if (repCurrencyRate <= 1 || repCurrencyCode === "USD") return null;
  var local = usdAmt * repCurrencyRate;
  if (local >= 10000000)    return repCurrencySymbol + (local/10000000).toFixed(2) + " Cr";
  else if (local >= 100000) return repCurrencySymbol + (local/100000).toFixed(2) + " L";
  else                      return repCurrencySymbol + local.toLocaleString("en-US",{maximumFractionDigits:0});
}

// Show local first, USD below
function repPrice(usdAmt) {
  var local = toRepLocal(usdAmt);
  if (!local) return formatPrice(usdAmt, "$");
  return '<strong>' + local + '</strong><br><span style="font-size:12px;color:var(--gray-400);">(' + formatPrice(usdAmt, "$") + ' USD)</span>';
}

// RMSE — local first, USD below
function repRmse(usdRmse) {
  if (repCurrencyRate <= 1 || repCurrencyCode === "USD") return repCurrencySymbol + Number(usdRmse).toLocaleString();
  var localVal = usdRmse * repCurrencyRate;
  return repCurrencySymbol + localVal.toLocaleString("en-US",{maximumFractionDigits:0}) +
    '<span style="font-size:11px;color:var(--gray-400);display:block;">(USD ' + Number(usdRmse).toLocaleString() + ')</span>';
}

async function loadReport() {
  try {
    var res  = await fetch("http://localhost:5000/api/model-results");
    var data = await res.json();
    document.getElementById("reportLoading").style.display = "none";
    document.getElementById("reportContent").style.display = "block";
    if (!data.success) {
      document.getElementById("reportContent").innerHTML =
        '<div class="card"><p style="color:var(--error);text-align:center;padding:2rem;">⚠️ Models not trained yet. Run <code>python ml_model.py</code> first.</p></div>';
      return;
    }
    buildReport(data.results, data.best_model);
  } catch(e) {
    document.getElementById("reportLoading").innerHTML =
      '<p style="color:var(--error);text-align:center;padding:2rem;">❌ Cannot connect to backend. Run: <code>python app.py</code></p>';
  }
}

function buildReport(results, bestModel) {
  _activeCurrencySymbol = repCurrencySymbol || "$";
  var sorted      = Object.entries(results).sort(function(a,b){ return b[1].accuracy - a[1].accuracy; });
  var bestMetrics = results[bestModel];

  // Currency banner
  var cb = document.getElementById("currencyBanner");
  if (repCountry && repCurrencyCode !== "USD") {
    cb.innerHTML =
      '🌍 <strong>' + repCountry + '</strong> &nbsp;|&nbsp; ' +
      '💱 <strong>1 USD = ' + repCurrencyRate + ' ' + repCurrencyCode + '</strong>' +
      (repInflation ? ' &nbsp;|&nbsp; 📈 <strong>Inflation: ' + repInflation + '% (' + repInflationYear + ')</strong>' : '');
    cb.style.display = "block";
  } else {
    cb.style.display = "none";
  }

  // Summary cards — local currency first
  var bestRmseLocal = toRepLocal(bestMetrics.rmse);
  document.getElementById("reportSummary").innerHTML =
    '<div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-info"><div class="stat-value" style="font-size:14px;">' + bestModel + '</div><div class="stat-label">Best Algorithm</div></div></div>' +
    '<div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-info"><div class="stat-value">' + bestMetrics.accuracy + '%</div><div class="stat-label">Best Accuracy (R²)</div></div></div>' +
    '<div class="stat-card"><div class="stat-icon">📊</div><div class="stat-info"><div class="stat-value">' + bestMetrics.f_score + '%</div><div class="stat-label">Best F-Score</div></div></div>' +
    '<div class="stat-card"><div class="stat-icon">📉</div><div class="stat-info"><div class="stat-value" style="font-size:16px;">' +
      (bestRmseLocal || (repCurrencySymbol+Number(bestMetrics.rmse).toLocaleString())) +
    '</div><div class="stat-label">Best RMSE (' + repCurrencyCode + ')</div></div></div>';

  // Accuracy bars
  document.getElementById("accuracyBars").innerHTML = sorted.map(function(entry, idx) {
    var name = entry[0], m = entry[1], isBest = (name === bestModel);
    var info = ALGO_DESCRIPTIONS[name] || {};
    return '<div class="acc-row">' +
      '<div class="acc-row-label">' + MEDALS[idx] + ' ' + (info.emoji||"🤖") + ' ' + name + '</div>' +
      '<div class="acc-row-bar-wrap"><div class="acc-row-bar ' + (isBest?"best-bar":"") + '" style="width:' + m.accuracy + '%">' + m.accuracy + '%</div></div>' +
      '<div class="acc-row-value">' + m.accuracy + '%</div></div>';
  }).join("");

  // Metrics table — LOCAL first, USD below
  document.getElementById("reportTableBody").innerHTML = sorted.map(function(entry, idx) {
    var name = entry[0], m = entry[1], isBest = (name === bestModel);
    var info = ALGO_DESCRIPTIONS[name] || {};
    return '<tr style="' + (isBest?"background:var(--lavender-100);font-weight:600;":"") + '">' +
      '<td>' + (info.emoji||"🤖") + ' ' + name + ' ' + (isBest?'<span class="badge badge-purple">✅ Best</span>':"") + '</td>' +
      '<td><strong>' + m.accuracy + '%</strong></td>' +
      '<td>' + m.precision + '%</td>' +
      '<td>' + m.f_score + '%</td>' +
      '<td>' + repRmse(m.rmse) + '</td>' +
      '<td>' + MEDALS[idx] + '</td></tr>';
  }).join("");

  // Best algo section
  var bestInfo = ALGO_DESCRIPTIONS[bestModel] || {};
  var bestRmseStr = bestRmseLocal
    ? bestRmseLocal + " (~USD " + Number(bestMetrics.rmse).toLocaleString() + ")"
    : repCurrencySymbol + Number(bestMetrics.rmse).toLocaleString();
  document.getElementById("bestAlgoReport").innerHTML =
    '<div class="best-algo-summary">' +
      '<div class="best-algo-metric"><div class="met-value">' + bestMetrics.accuracy + '%</div><div class="met-label">R² Accuracy</div></div>' +
      '<div class="best-algo-metric"><div class="met-value">' + bestMetrics.precision + '%</div><div class="met-label">Precision</div></div>' +
      '<div class="best-algo-metric"><div class="met-value">' + bestMetrics.f_score + '%</div><div class="met-label">F-Score</div></div>' +
    '</div>' +
    '<div class="best-algo-why">' +
      '<p><strong>' + (bestInfo.emoji||"🏆") + ' ' + bestModel + '</strong> is the recommended algorithm because:</p>' +
      '<ul style="margin-top:10px;padding-left:20px;line-height:2.2;">' +
        '<li>Highest R² accuracy: <strong>' + bestMetrics.accuracy + '%</strong></li>' +
        '<li>Best F-Score: <strong>' + bestMetrics.f_score + '%</strong></li>' +
        '<li>Lowest RMSE: <strong>' + bestRmseStr + '</strong> — average prediction error</li>' +
        '<li>' + (bestInfo.desc||"") + '</li>' +
      '</ul>' +
    '</div>';

  // Last user prediction section
  var lastPred = localStorage.getItem("pn_last_prediction");
  var lastPredSection = document.getElementById("lastPredSection");
  if (lastPred && lastPredSection) {
    try {
      var pred = JSON.parse(lastPred);
      var predsHtml = Object.entries(pred.predictions)
        .sort(function(a,b){ return b[1].accuracy - a[1].accuracy; })
        .map(function(entry, idx) {
          var n = entry[0], m = entry[1], isBest = (n === pred.best_model);
          var localP   = toRepLocal(m.predicted_price);
          var adjUSD   = m.predicted_price * (1 + (repInflation||0)/100);
          var localAdj = repInflation ? toRepLocal(adjUSD) : null;
          return '<tr style="' + (isBest?"background:var(--lavender-100);font-weight:600;":"") + '">' +
            '<td>' + (ALGO_DESCRIPTIONS[n]&&ALGO_DESCRIPTIONS[n].emoji||"🤖") + ' ' + n +
              (isBest?' <span class="badge badge-purple">Best</span>':"") + '</td>' +
            // LOCAL first, USD below
            '<td>' + (localP
              ? '<strong>' + localP + '</strong><br><span style="font-size:12px;color:var(--gray-400);">' + formatPrice(m.predicted_price, "$") + ' USD</span>'
              : '<strong>' + formatPrice(m.predicted_price, "$") + '</strong>') + '</td>' +
            '<td>' + (localAdj
              ? '<span style="color:var(--success);font-weight:600;">' + localAdj + '</span><br><small style="color:var(--gray-400);">' + formatPrice(adjUSD, "$") + '</small>'
              : '—') + '</td>' +
            '<td>' + m.accuracy + '%</td>' +
            '<td>' + m.precision + '%</td>' +
            '<td>' + m.f_score + '%</td>' +
            '</tr>';
        }).join("");

      lastPredSection.style.display = "block";
      document.getElementById("lastPredContent").innerHTML =
        '<div style="background:var(--lavender-100);border-radius:var(--radius);padding:16px;margin-bottom:16px;border:1px solid var(--lavender-300);">' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;">' +
            '<div><span style="font-size:12px;color:var(--gray-500);">💰 Income</span>' + (function(){ var li = toRepLocal(parseFloat(pred.inputs.income)); return li && repCurrencyCode !== "USD" ? '<div style="font-weight:700;color:var(--lavender-700);">' + li + '</div><div style="font-size:11px;color:var(--gray-400);">($' + Number(pred.inputs.income).toLocaleString() + ')</div>' : '<div style="font-weight:600;">$' + Number(pred.inputs.income).toLocaleString() + '</div>'; })() + '</div>' +
            '<div><span style="font-size:12px;color:var(--gray-500);">📅 House Age</span><div style="font-weight:600;">' + pred.inputs.houseAge + ' yrs</div></div>' +
            '<div><span style="font-size:12px;color:var(--gray-500);">🚪 Rooms</span><div style="font-weight:600;">' + pred.inputs.numRooms + '</div></div>' +
            '<div><span style="font-size:12px;color:var(--gray-500);">🛏️ Bedrooms</span><div style="font-weight:600;">' + pred.inputs.numBedrooms + '</div></div>' +
            '<div><span style="font-size:12px;color:var(--gray-500);">👥 Population</span><div style="font-weight:600;">' + Number(pred.inputs.population).toLocaleString() + '</div></div>' +
            '<div><span style="font-size:12px;color:var(--gray-500);">🌍 Country</span><div style="font-weight:600;">' + (pred.country||"N/A") + '</div></div>' +
            (pred.inflationRate ? '<div><span style="font-size:12px;color:var(--gray-500);">📈 Inflation</span><div style="font-weight:600;">' + pred.inflationRate + '% (' + (pred.inflationYear||"") + ')</div></div>' : '') +
            (pred.currencyCode && pred.currencyCode !== "USD" ? '<div><span style="font-size:12px;color:var(--gray-500);">💱 Rate</span><div style="font-weight:600;">1 USD = ' + pred.currencyRate + ' ' + pred.currencyCode + '</div></div>' : '') +
            '<div><span style="font-size:12px;color:var(--gray-500);">🕐 Time</span><div style="font-weight:600;font-size:12px;">' + pred.timestamp + '</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="table-wrap"><table>' +
          '<thead><tr><th>🤖 Algorithm</th><th>💵 Predicted Price</th><th>🌍 Inflation Adj</th><th>🎯 Accuracy</th><th>🎯 Precision</th><th>📊 F-Score</th></tr></thead>' +
          '<tbody>' + predsHtml + '</tbody>' +
        '</table></div>' +
        '<div style="margin-top:14px;padding:14px;background:var(--lavender-100);border-radius:var(--radius-sm);border-left:4px solid var(--lavender-500);">' +
          '🏆 <strong>Best: ' + (toRepLocal(pred.best_price)||formatPrice(pred.best_price, "$")) +
          (toRepLocal(pred.best_price) ? ' (' + formatPrice(pred.best_price, "$") + ' USD)' : '') +
          '</strong> by <strong>' + pred.best_model + '</strong><br>' +
          '<span style="font-size:13px;color:var(--gray-600);margin-top:4px;display:block;">' + pred.reason + '</span>' +
        '</div>';
    } catch(e) {}
  }

  // Algo descriptions
  document.getElementById("algoDescriptions").innerHTML = Object.entries(ALGO_DESCRIPTIONS).map(function(entry) {
    var name = entry[0], info = entry[1], m = results[name] || {};
    var localRmse = toRepLocal(m.rmse||0);
    return '<div class="algo-desc-card">' +
      '<div class="algo-name">' + info.emoji + ' ' + name + (name===bestModel?' <span class="badge badge-purple">Best</span>':"") + '</div>' +
      '<p>' + info.desc + '</p>' +
      '<div style="margin-top:8px;font-size:12px;color:var(--lavender-700);font-weight:600;">' +
        'Accuracy: ' + (m.accuracy||"—") + '% | F-Score: ' + (m.f_score||"—") + '%' +
        ' | RMSE: ' + (localRmse || (repCurrencySymbol+(m.rmse||0).toLocaleString())) +
      '</div></div>';
  }).join("");
}
