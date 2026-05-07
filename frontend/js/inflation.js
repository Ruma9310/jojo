// ============================================================
// PriceNest - Inflation Rate + Currency (Safe Version)
// ============================================================

// Global vars - always defined, never undefined
var currentInflationRate  = null;
var currentCountryName    = "";
var inflationYear         = "";
var currentCurrencyRate   = 1;
var currentCurrencySymbol = "$";
var currentCurrencyCode   = "USD";

var COUNTRY_INFO = {
  "IN":{ name:"India",         currency:"INR", symbol:"₹",  flag:"🇮🇳" },
  "US":{ name:"United States", currency:"USD", symbol:"$",  flag:"🇺🇸" },
  "GB":{ name:"United Kingdom",currency:"GBP", symbol:"£",  flag:"🇬🇧" },
  "CN":{ name:"China",         currency:"CNY", symbol:"¥",  flag:"🇨🇳" },
  "JP":{ name:"Japan",         currency:"JPY", symbol:"¥",  flag:"🇯🇵" },
  "DE":{ name:"Germany",       currency:"EUR", symbol:"€",  flag:"🇩🇪" },
  "FR":{ name:"France",        currency:"EUR", symbol:"€",  flag:"🇫🇷" },
  "AU":{ name:"Australia",     currency:"AUD", symbol:"A$", flag:"🇦🇺" },
  "CA":{ name:"Canada",        currency:"CAD", symbol:"C$", flag:"🇨🇦" },
  "BR":{ name:"Brazil",        currency:"BRL", symbol:"R$", flag:"🇧🇷" },
  "ZA":{ name:"South Africa",  currency:"ZAR", symbol:"R",  flag:"🇿🇦" },
  "SG":{ name:"Singapore",     currency:"SGD", symbol:"S$", flag:"🇸🇬" },
  "AE":{ name:"UAE",           currency:"AED", symbol:"د.إ",flag:"🇦🇪" },
  "PK":{ name:"Pakistan",      currency:"PKR", symbol:"₨",  flag:"🇵🇰" },
  "BD":{ name:"Bangladesh",    currency:"BDT", symbol:"৳",  flag:"🇧🇩" },
  "NG":{ name:"Nigeria",       currency:"NGN", symbol:"₦",  flag:"🇳🇬" },
  "MX":{ name:"Mexico",        currency:"MXN", symbol:"$",  flag:"🇲🇽" },
  "ID":{ name:"Indonesia",     currency:"IDR", symbol:"Rp", flag:"🇮🇩" },
  "KR":{ name:"South Korea",   currency:"KRW", symbol:"₩",  flag:"🇰🇷" },
  "IT":{ name:"Italy",         currency:"EUR", symbol:"€",  flag:"🇮🇹" }
};

var ESTIMATED_2026 = {
  "IN":4.5,"US":3.0,"GB":2.8,"CN":1.5,"JP":2.5,
  "DE":2.3,"FR":2.1,"AU":3.2,"CA":2.6,"BR":5.2,
  "ZA":5.8,"SG":2.0,"AE":2.5,"PK":12.0,"BD":7.5,
  "NG":22.0,"MX":4.8,"ID":3.5,"KR":2.3,"IT":1.8
};

var FALLBACK_RATES = {
  "INR":84.0,"GBP":0.79,"EUR":0.92,"CNY":7.24,"JPY":149.5,
  "AUD":1.53,"CAD":1.36,"BRL":5.0,"ZAR":18.6,"SGD":1.34,
  "AED":3.67,"PKR":280.0,"BDT":110.0,"NGN":1560.0,
  "MXN":17.1,"IDR":15800.0,"KRW":1330.0
};

function hideAllInflationStatus() {
  try {
    ["inflationLoading","inflationSuccess","inflationError"].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  } catch(e) {}
}

async function fetchInflationRate() {
  try {
    var countryCode = document.getElementById("countrySelect").value;
    if (!countryCode) return;

    var info = COUNTRY_INFO[countryCode] || { name:countryCode, currency:"USD", symbol:"$", flag:"🌍" };
    currentCountryName    = info.name;
    currentCurrencyCode   = info.currency;
    currentCurrencySymbol = info.symbol;
    currentCurrencyRate   = 1;
    currentInflationRate  = null;

    // Update income label to show local currency symbol
    var incomeLabel = document.getElementById("incomeCurrencyLabel");
    if (incomeLabel) {
      incomeLabel.textContent = (info.currency === "USD") ? "$" : info.symbol + " / $";
    }

    hideAllInflationStatus();
    var loadEl = document.getElementById("inflationLoading");
    if (loadEl) {
      loadEl.style.display = "flex";
      var span = loadEl.querySelector("span");
      if (span) span.textContent = "Fetching data for " + info.flag + " " + info.name + "...";
    }

    var manualEl = document.getElementById("manualInflation");
    if (manualEl) manualEl.value = "";

    // Fetch inflation and exchange rate in parallel
    var inflOk = await fetchWorldBankInflation(countryCode);
    await fetchExchangeRate(info.currency);

    hideAllInflationStatus();

    if (!inflOk) {
      var est = ESTIMATED_2026[countryCode];
      if (est !== undefined) {
        currentInflationRate = est;
        inflationYear = "2025-26 Est.";
      }
    }

    // Show result
    if (currentInflationRate !== null) {
      var successEl = document.getElementById("inflationSuccess");
      var msgEl     = document.getElementById("inflationSuccessMsg");
      if (successEl && msgEl) {
        successEl.style.display = "flex";
        var src = inflationYear === "2025-26 Est." ? "IMF estimate" : "World Bank";
        msgEl.innerHTML =
          info.flag + " <strong>" + info.name + "</strong> &nbsp;|&nbsp; " +
          "📈 Inflation: <strong>" + currentInflationRate + "%</strong> (" + inflationYear + ")" +
          " <span style='font-size:11px;opacity:0.8;'>(" + src + ")</span>" +
          (currentCurrencyCode !== "USD" ? " &nbsp;|&nbsp; 💱 1 USD = " + currentCurrencyRate + " " + currentCurrencyCode : "");
        if (manualEl) manualEl.value = currentInflationRate;
      }
    }
  } catch(e) {
    hideAllInflationStatus();
    var errEl  = document.getElementById("inflationError");
    var errMsg = document.getElementById("inflationErrorMsg");
    if (errEl && errMsg) {
      errEl.style.display  = "flex";
      errMsg.textContent   = "Could not fetch data. Enter rate manually.";
    }
  }
}

async function fetchWorldBankInflation(countryCode) {
  try {
    var url  = "https://api.worldbank.org/v2/country/" + countryCode + "/indicator/FP.CPI.TOTL.ZG?format=json&mrv=3&per_page=3";
    var res  = await fetch(url);
    var json = await res.json();
    if (!json || !json[1]) return false;
    for (var i = 0; i < json[1].length; i++) {
      if (json[1][i].value !== null) {
        currentInflationRate = parseFloat(json[1][i].value.toFixed(2));
        inflationYear        = json[1][i].date;
        return true;
      }
    }
    return false;
  } catch(e) { return false; }
}

async function fetchExchangeRate(toCurrency) {
  if (toCurrency === "USD") { currentCurrencyRate = 1; return; }
  try {
    var res  = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    var json = await res.json();
    if (json && json.rates && json.rates[toCurrency]) {
      currentCurrencyRate = parseFloat(json.rates[toCurrency].toFixed(4));
      return;
    }
  } catch(e) {}
  // Use fallback
  if (FALLBACK_RATES[toCurrency]) {
    currentCurrencyRate = FALLBACK_RATES[toCurrency];
  }
}

function onManualInflationInput() {
  try {
    var val = parseFloat(document.getElementById("manualInflation").value);
    if (!isNaN(val) && val >= 0) {
      currentInflationRate = val;
      inflationYear        = "Custom";
      hideAllInflationStatus();
      var successEl = document.getElementById("inflationSuccess");
      var msgEl     = document.getElementById("inflationSuccessMsg");
      if (successEl && msgEl) {
        successEl.style.display = "flex";
        msgEl.innerHTML = "✅ Custom rate: <strong>" + val + "%</strong>" +
          (currentCurrencyCode !== "USD" ? " &nbsp;|&nbsp; 💱 1 USD = " + currentCurrencyRate + " " + currentCurrencyCode : "");
      }
    } else {
      currentInflationRate = null;
    }
  } catch(e) {}
}

function applyInflation(basePrice) {
  try {
    var card = document.getElementById("inflationAdjustedCard");
    if (!card) return;
    if (!currentInflationRate) { card.style.display = "none"; return; }

    var adjUSD = basePrice * (1 + currentInflationRate / 100);
    var diff   = adjUSD - basePrice;
    var diffStr = (diff >= 0 ? "+" : "") + formatPrice(diff, "$");

    // Local currency conversion
    var localAdj = null;
    if (currentCurrencyRate > 1 && currentCurrencyCode !== "USD") {
      var la = adjUSD * currentCurrencyRate;
      if (la >= 10000000)    localAdj = currentCurrencySymbol + (la/10000000).toFixed(2) + " Cr";
      else if (la >= 100000) localAdj = currentCurrencySymbol + (la/100000).toFixed(2) + " L";
      else                   localAdj = currentCurrencySymbol + la.toLocaleString("en-US",{maximumFractionDigits:0});
    }

    document.getElementById("adjustedPrice").innerHTML =
      (localAdj || formatPrice(adjUSD, "$")) +
      (localAdj ? '<span style="font-size:0.6em;opacity:0.75;display:block;">(' + formatPrice(adjUSD, "$") + ' USD)</span>' : '');

    document.getElementById("inflationRateDisplay").textContent = currentInflationRate + "%";
    document.getElementById("adjustedInfo").textContent =
      currentCountryName + " inflation (" + inflationYear + ")" +
      (currentCurrencyCode !== "USD" ? " · 1 USD = " + currentCurrencyRate + " " + currentCurrencyCode : "");

    document.getElementById("inflationExplainText").innerHTML =
      "📌 <strong>Base price</strong> " + formatPrice(basePrice, "$") +
      " × (1 + " + currentInflationRate + "%) = " +
      "<strong>" + formatPrice(adjUSD, "$") + "</strong>" +
      (localAdj ? " = <strong>" + localAdj + "</strong>" : "") +
      " (" + diffStr + " difference)." +
      (inflationYear === "2025-26 Est." ? " <em style='font-size:12px;opacity:0.8;'>(IMF estimate — 2026 official data pending)</em>" : "");

    card.style.display = "block";
  } catch(e) {
    var card2 = document.getElementById("inflationAdjustedCard");
    if (card2) card2.style.display = "none";
  }
}
