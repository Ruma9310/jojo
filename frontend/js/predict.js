// ============================================================
// PriceNest - Prediction Page Logic (Location-Aware)
// ============================================================

var MODEL_INFO = {
  "Linear Regression":  { emoji:"📈", short:"Simple linear model — fast and interpretable. Best when features have a roughly linear relationship with price." },
  "Decision Tree":      { emoji:"🌳", short:"Tree-based model — handles non-linear patterns and interactions between features very well." },
  "Random Forest":      { emoji:"🌲", short:"Builds 100 decision trees and averages them — reduces overfitting and gives very accurate results." },
  "Gradient Boosting":  { emoji:"🚀", short:"Trains trees sequentially, each correcting the last — often the most accurate on tabular real-estate data." }
};

var _activeCurrencySymbol = "$";

window.addEventListener("DOMContentLoaded", function() {
  if (typeof requireAuth === "function") {
    var user = requireAuth(false);
    if (!user) return;
    if (typeof updateNavbar === "function") updateNavbar(user);
  }
  safeHideInflation();
});

function safeHideInflation() {
  ["inflationLoading","inflationSuccess","inflationError"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function _showAlert(msg) {
  var box = document.getElementById("predictAlert");
  var txt = document.getElementById("predictAlertMsg");
  if (box && txt) {
    txt.textContent = msg;
    box.style.display = "block";
    setTimeout(function() { box.style.display = "none"; }, 6000);
  } else { alert(msg); }
}

// ── Neighbourhood suggestions ─────────────────────────────────
// Called by location_wizard when city is chosen; populates neighbourhood datalist
function updateNeighbourhoodSuggestions(countryCode, stateName, cityName) {
  var list = document.getElementById("neighbourhoodList");
  var inp  = document.getElementById("neighbourhood");
  if (!list || !inp) return;
  inp.value = "";
  list.innerHTML = "";
  if (typeof getNeighbourhoods !== "function") return;
  var hoods = getNeighbourhoods(countryCode, stateName, cityName);
  hoods.forEach(function(h) {
    var opt = document.createElement("option");
    opt.value = h;
    list.appendChild(opt);
  });
  var hoodGroup = document.getElementById("neighbourhoodGroup");
  if (hoodGroup) {
    hoodGroup.style.display = hoods.length > 0 ? "block" : "none";
  }
  updateNeighbourhoodHint(countryCode, stateName, cityName);
}

function updateNeighbourhoodHint(countryCode, stateName, cityName) {
  var hint = document.getElementById("neighbourhoodHint");
  if (!hint || typeof getNeighbourhoods !== "function") return;
  var hoods = getNeighbourhoods(countryCode, stateName, cityName);
  if (hoods.length === 0) { hint.textContent = ""; return; }
  hint.textContent = hoods.length + " neighbourhoods available — type or pick from the list";
}

// ── Mock ML engine (location-aware, house-size-aware) ────────
function _mockPredict(income, houseAge, numRooms, numBedrooms, population, locData, houseSizeSqft, propertyType) {
  var areaType     = (locData && locData.areaType)     ? locData.areaType     : "urban";
  var countryCode  = (locData && locData.countryCode)  ? locData.countryCode  : "";
  var stateCode    = (locData && locData.stateCode)    ? locData.stateCode    : (locData && locData.stateName ? locData.stateName : "");
  var stateName    = (locData && locData.stateName)    ? locData.stateName    : "";
  var cityName     = (locData && locData.cityName)     ? locData.cityName     : "";
  var neighbourhood= (locData && locData.neighbourhood)? locData.neighbourhood: "";

  // Property type multiplier
  var propMult = { "plot":0.70, "apartment":1.00, "house":1.15, "villa":1.40 };
  var ptMult = propMult[(propertyType || "apartment").toLowerCase()] || 1.00;

  // House size: sqft → price contribution (~$55 per sqft baseline)
  var sqft = (houseSizeSqft && houseSizeSqft > 0) ? houseSizeSqft : Math.max(400, numRooms * 250);
  var sizeBonus = sqft * 55;

  // ── Step 1: Base price from all features ─────────────────────
  var base = income * 3.2;
  base += (10 - Math.min(houseAge, 50)) * 700;
  base += numRooms    * 8000;
  base -= numBedrooms * 3000;
  base -= population  * 0.15;
  base += sizeBonus;
  base *= ptMult;
  base  = Math.max(40000, base);

  // ── Step 2: Location multiplier ───────────────────────────────
  var locMulti = 1.0;
  if (typeof getLocationPriceMultiplier === "function" && countryCode) {
    locMulti = getLocationPriceMultiplier(countryCode, stateCode, cityName, neighbourhood, areaType);
  } else {
    var areaMap = { "urban": 1.10, "semi-urban": 0.82, "rural": 0.55 };
    locMulti = areaMap[areaType] || 1.0;
  }
  base = base * locMulti;

  // ── Step 3: Inflation ─────────────────────────────────────────
  var inflRate = (locData && locData.inflationRate !== null) ? locData.inflationRate : null;

  base = Math.max(50000, Math.min(8000000, Math.round(base)));

  // ── Step 4: Per-model variance ────────────────────────────────
  var models = {
    "Random Forest":     { mult:1.000, r2:89.4, prec:87.2, fs:88.1, rmse_pct:0.068 },
    "Gradient Boosting": { mult:0.991, r2:88.7, prec:86.8, fs:87.6, rmse_pct:0.071 },
    "Decision Tree":     { mult:1.028, r2:82.5, prec:80.3, fs:81.2, rmse_pct:0.089 },
    "Linear Regression": { mult:0.948, r2:76.3, prec:74.1, fs:75.0, rmse_pct:0.112 }
  };

  var predictions = {};
  Object.keys(models).forEach(function(name) {
    var m     = models[name];
    var price = Math.round(base * m.mult);
    predictions[name] = {
      predicted_price: price,
      accuracy:        m.r2,
      precision:       m.prec,
      f_score:         m.fs,
      rmse:            Math.round(price * m.rmse_pct)
    };
  });

  var locParts = [];
  if (neighbourhood) locParts.push(neighbourhood);
  else if (cityName) locParts.push(cityName);
  if (stateName) locParts.push(stateName);
  var locStr = locParts.length ? locParts.join(", ") : (areaType + " area");

  var multiPct  = ((locMulti - 1) * 100).toFixed(0);
  var multiSign = locMulti >= 1 ? "+" : "";
  var locationNote = (typeof getLocationPriceMultiplier === "function" && countryCode)
    ? " Location index for <strong>" + locStr + "</strong>: " + multiSign + multiPct + "% vs baseline."
    : "";

  return {
    success:     true,
    predictions: predictions,
    best_model:  "Random Forest",
    best_price:  predictions["Random Forest"].predicted_price,
    reason:      "Random Forest achieved the highest R² of 89.4%, explaining ~89% of price variance." + locationNote,
    source:      "mock",
    locMulti:    locMulti
  };
}

// ── Main prediction function ──────────────────────────────────
async function runPrediction() {
  var alertBox = document.getElementById("predictAlert");
  if (alertBox) alertBox.style.display = "none";

  var income      = document.getElementById("income").value.trim();
  var houseAge    = document.getElementById("houseAge").value.trim();
  var numRooms    = document.getElementById("numRooms").value.trim();
  var numBedrooms = document.getElementById("numBedrooms").value.trim();
  var population  = document.getElementById("population").value.trim();
  var houseSizeSqft = (typeof window.getSizeInSqft === "function") ? window.getSizeInSqft() : 0;
  var propertyType  = (document.getElementById("propertyType") ? document.getElementById("propertyType").value : "apartment");

  if (!income || !houseAge || !numRooms || !numBedrooms || !population) {
    _showAlert("⚠️ Please fill in all 5 property fields before predicting.");
    return;
  }
  if (isNaN(parseFloat(income)) || isNaN(parseFloat(houseAge)) ||
      isNaN(parseInt(numRooms)) || isNaN(parseInt(numBedrooms)) ||
      isNaN(parseFloat(population))) {
    _showAlert("⚠️ All fields must be valid numbers.");
    return;
  }

  var locSnapshot = (typeof window.currentLocationState !== "undefined") ? window.currentLocationState : null;
  if (locSnapshot && locSnapshot.cityName && !locSnapshot.areaType) {
    _showAlert("⚠️ You selected a city — please also choose Urban, Semi-Urban, or Rural area type.");
    return;
  }

  document.getElementById("resultsPanel").style.display = "none";
  document.getElementById("loadingPanel").style.display = "flex";
  var notice = document.getElementById("mockNotice");
  if (notice) notice.style.display = "none";

  // Gather globals
  var inflRate   = (typeof currentInflationRate  !== "undefined" && currentInflationRate !== null) ? currentInflationRate  : null;
  var currCode   = (typeof currentCurrencyCode   !== "undefined") ? currentCurrencyCode   : "USD";
  var currSymbol = (typeof currentCurrencySymbol !== "undefined") ? currentCurrencySymbol : "$";
  var currRate   = (typeof currentCurrencyRate   !== "undefined") ? currentCurrencyRate   : 1;
  var cntry      = (typeof currentCountryName    !== "undefined") ? currentCountryName    : "";
  var inflYear   = (typeof inflationYear         !== "undefined") ? inflationYear         : "";

  var locData = locSnapshot;
  var areaType = (locData && locData.areaType) ? locData.areaType : "urban";
  var neighbourhood = "";
  var hoodEl = document.getElementById("neighbourhood");
  if (hoodEl && hoodEl.value.trim()) neighbourhood = hoodEl.value.trim();

  if (locData) {
    if (locData.currencyCode   && locData.currencyCode   !== "USD") currCode   = locData.currencyCode;
    if (locData.currencySymbol && locData.currencySymbol !== "$")   currSymbol = locData.currencySymbol;
    if (locData.currencyRate   && locData.currencyRate   > 1)       currRate   = locData.currencyRate;
    if (locData.countryName)                                         cntry      = locData.countryName;
  }

  // Attach neighbourhood and inflationRate to locData for mock engine
  var enrichedLocData = Object.assign({}, locData, {
    neighbourhood: neighbourhood,
    inflationRate: inflRate
  });

  var username = ""; var role = "user"; var email = "";
  try {
    username = localStorage.getItem("pn_username") || "";
    role     = localStorage.getItem("pn_role")     || "user";
    email    = localStorage.getItem("pn_email")    || "";
  } catch(e) {}

  var payload = {
    username:        username, role: role, email: email,
    income:          parseFloat(income),
    house_age:       parseFloat(houseAge),
    num_rooms:       parseInt(numRooms),
    num_bedrooms:    parseInt(numBedrooms),
    population:      parseFloat(population),
    house_size:      houseSizeSqft,
    property_type:   propertyType,
    country:         cntry,
    currency_code:   currCode,
    currency_symbol: currSymbol,
    currency_rate:   currRate,
    inflation_rate:  inflRate,
    inflation_year:  inflYear,
    area_type:       areaType,
    neighbourhood:   neighbourhood,
    city:            (locData && locData.cityName)  ? locData.cityName  : "",
    state:           (locData && locData.stateName) ? locData.stateName : "",
    state_code:      (locData && locData.stateCode) ? locData.stateCode : "",
    pin_code:        (locData && locData.pinCode)   ? locData.pinCode   : ""
  };

  var data = null;

  // Try real backend first
  try {
    var controller = new AbortController();
    var tid = setTimeout(function() { controller.abort(); }, 4000);
    var response = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type":"application/json", "X-Username":username, "X-Role":role, "X-Email":email },
      body:   JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(tid);
    if (response.ok) { data = await response.json(); }
  } catch(e) { data = null; }

  // Fall back to browser-side mock ML with location awareness
  if (!data || !data.success) {
    await new Promise(function(r) { setTimeout(r, 800); });
    data = _mockPredict(
      parseFloat(income), parseFloat(houseAge),
      parseInt(numRooms),  parseInt(numBedrooms),
      parseFloat(population), enrichedLocData,
      houseSizeSqft, propertyType
    );
    if (notice) notice.style.display = "flex";
  }

  document.getElementById("loadingPanel").style.display = "none";

  if (data && data.success) {
    try {
      localStorage.setItem("pn_last_prediction", JSON.stringify({
        inputs:         { income, houseAge, numRooms, numBedrooms, population, houseSizeSqft, propertyType },
        predictions:    data.predictions,
        best_model:     data.best_model,
        best_price:     data.best_price,
        reason:         data.reason,
        country:        cntry,
        currencyCode:   currCode,
        currencySymbol: currSymbol,
        currencyRate:   currRate,
        inflationRate:  inflRate,
        inflationYear:  inflYear,
        areaType:       areaType,
        neighbourhood:  neighbourhood,
        city:           payload.city,
        state:          payload.state,
        timestamp:      new Date().toLocaleString()
      }));
    } catch(e) {}
    displayResults(data, inflRate, currCode, currSymbol, currRate, cntry);
  } else {
    _showAlert("❌ Prediction failed. Please check your inputs and try again.");
  }
}

// ── Currency helpers ──────────────────────────────────────────
function safeToLocal(usdAmt, currRate, currSymbol, currCode) {
  if (!currRate || currRate <= 1 || currCode === "USD") return null;
  var local = usdAmt * currRate;
  if (local >= 10000000)    return currSymbol + (local/10000000).toFixed(2) + " Cr";
  else if (local >= 100000) return currSymbol + (local/100000).toFixed(2) + " L";
  else                      return currSymbol + local.toLocaleString("en-US",{maximumFractionDigits:0});
}

function _fmt(amount, sym) {
  var s = sym || _activeCurrencySymbol || "$";
  if (typeof formatPrice === "function") return formatPrice(amount, s);
  return s + Number(amount).toLocaleString("en-US",{maximumFractionDigits:0});
}

// ── Display results ───────────────────────────────────────────
function displayResults(data, inflRate, currCode, currSymbol, currRate, cntry) {
  _activeCurrencySymbol = currSymbol || "$";

  var predictions = data.predictions;
  var best_model  = data.best_model;
  var best_price  = data.best_price;
  var localBest   = safeToLocal(best_price, currRate, currSymbol, currCode);

  if (localBest) {
    document.getElementById("bestPrice").innerHTML =
      localBest + '<span style="font-size:0.5em;opacity:0.75;display:block;margin-top:4px;">(' + _fmt(best_price,"$") + ' USD)</span>';
  } else {
    document.getElementById("bestPrice").textContent = _fmt(best_price, currSymbol);
  }
  document.getElementById("bestModelLabel").textContent = "by " + best_model;
  document.getElementById("bestReason").innerHTML       = data.reason; // innerHTML for bold location note

  var countryTag = document.getElementById("countryTag");
  if (countryTag) {
    if (cntry && currCode && currCode !== "USD") {
      countryTag.innerHTML     = "🌍 " + cntry + " · " + currCode + " · 1 USD = " + currRate + " " + currCode;
      countryTag.style.display = "block";
    } else {
      countryTag.style.display = "none";
    }
  }

  if (typeof applyInflation === "function") {
    applyInflation(best_price);
  } else {
    var inflCard = document.getElementById("inflationAdjustedCard");
    if (inflCard) inflCard.style.display = "none";
  }

  // ── Location multiplier badge ──────────────────────────────
  var locBadge = document.getElementById("locMultiBadge");
  if (locBadge) {
    if (data.locMulti && data.locMulti !== 1.0) {
      var pct  = ((data.locMulti - 1) * 100).toFixed(0);
      var sign = data.locMulti >= 1 ? "+" : "";
      var col  = data.locMulti >= 1 ? "#059669" : "#dc2626";
      locBadge.innerHTML =
        '<span style="font-size:12px;font-weight:700;background:' + col + '20;color:' + col + ';' +
        'border:1.5px solid ' + col + '40;border-radius:20px;padding:4px 12px;display:inline-block;margin-top:6px;">' +
        '📍 Location adjustment: ' + sign + pct + '%</span>';
      locBadge.style.display = "block";
    } else {
      locBadge.style.display = "none";
    }
  }

  // ── Model cards ────────────────────────────────────────────
  var sorted = Object.entries(predictions).sort(function(a,b) { return b[1].accuracy - a[1].accuracy; });
  var container = document.getElementById("modelCards");
  container.innerHTML = "";

  sorted.forEach(function(entry, idx) {
    var name     = entry[0];
    var metrics  = entry[1];
    var info     = MODEL_INFO[name] || { emoji:"🤖", short:"" };
    var isBest   = (name === best_model);
    var localP   = safeToLocal(metrics.predicted_price, currRate, currSymbol, currCode);
    var adjUSD   = inflRate ? metrics.predicted_price * (1 + inflRate/100) : null;
    var localAdj = (adjUSD && currRate > 1) ? safeToLocal(adjUSD, currRate, currSymbol, currCode) : null;
    var localRmse = (currRate > 1 && currCode !== "USD")
      ? currSymbol + Math.round(metrics.rmse * currRate).toLocaleString("en-US") : null;

    var card = document.createElement("div");
    card.className = "model-card" + (isBest ? " is-best" : "");
    card.innerHTML =
      '<div class="model-name">' +
        '<span>' + info.emoji + ' ' + name + '</span>' +
        (isBest ? '<span class="badge badge-purple">🏆 Best</span>' : '<span class="badge badge-orange">#'+(idx+1)+'</span>') +
      '</div>' +
      (localP
        ? '<div class="model-price">' + localP + '</div>' +
          '<div style="font-size:12px;color:var(--gray-400);margin-bottom:4px;">(' + _fmt(metrics.predicted_price,"$") + ' USD)</div>'
        : '<div class="model-price">' + _fmt(metrics.predicted_price, currSymbol) + '</div>'
      ) +
      (adjUSD
        ? '<div style="font-size:12px;color:var(--success);font-weight:600;margin-bottom:8px;">' +
          '🌍 Adj: ' + (localAdj || _fmt(adjUSD, currSymbol)) +
          (localAdj ? ' <span style="font-size:11px;color:var(--gray-400);">(' + _fmt(adjUSD,"$") + ')</span>' : '') +
          '</div>' : '') +
      '<div class="acc-bar-wrap">' +
        '<div class="acc-bar-label"><span>Accuracy (R²)</span><span>' + metrics.accuracy + '%</span></div>' +
        '<div class="acc-bar"><div class="acc-bar-fill" style="width:0%" data-width="' + metrics.accuracy + '"></div></div>' +
      '</div>' +
      '<div class="model-metric"><span class="metric-label">🎯 Precision</span><span class="metric-value">' + metrics.precision + '%</span></div>' +
      '<div class="model-metric"><span class="metric-label">📊 F-Score</span><span class="metric-value">' + metrics.f_score + '%</span></div>' +
      '<div class="model-metric"><span class="metric-label">📉 RMSE</span><span class="metric-value">' +
        (localRmse
          ? localRmse + '<span style="font-size:11px;color:var(--gray-400);display:block;">($' + Number(metrics.rmse).toLocaleString() + ')</span>'
          : '$' + Number(metrics.rmse).toLocaleString()) +
      '</span></div>';
    container.appendChild(card);
  });

  setTimeout(function() {
    document.querySelectorAll(".acc-bar-fill").forEach(function(bar) {
      bar.style.width = bar.getAttribute("data-width") + "%";
    });
  }, 150);

  var bestInfo    = MODEL_INFO[best_model] || {};
  var bestMetrics = predictions[best_model];
  var bestRmseStr = (currRate > 1 && currCode !== "USD")
    ? currSymbol + Math.round(bestMetrics.rmse * currRate).toLocaleString("en-US") + " (~USD $" + Number(bestMetrics.rmse).toLocaleString() + ")"
    : "$" + Number(bestMetrics.rmse).toLocaleString();

  document.getElementById("bestAlgoExplain").innerHTML =
    '<p style="margin-bottom:12px;"><strong>' + (bestInfo.emoji||"🏆") + ' ' + best_model +
    '</strong> selected because it has the highest R² accuracy of <strong>' + bestMetrics.accuracy + '%</strong>.</p>' +
    '<p style="margin-bottom:12px;">' + (bestInfo.short||"") + '</p>' +
    '<div class="algo-fact">🎯 Accuracy: <strong>' + bestMetrics.accuracy + '%</strong> &nbsp;|&nbsp; ' +
    '📊 F-Score: <strong>' + bestMetrics.f_score + '%</strong> &nbsp;|&nbsp; ' +
    '🎯 Precision: <strong>' + bestMetrics.precision + '%</strong></div>' +
    '<div class="algo-fact" style="margin-top:8px;">📉 RMSE: <strong>' + bestRmseStr + '</strong>' +
    (cntry ? ' — average prediction error in <strong>' + cntry + '</strong>' : ' — average prediction error') + '.</div>';

  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("resultsPanel").scrollIntoView({ behavior:"smooth", block:"start" });
}
