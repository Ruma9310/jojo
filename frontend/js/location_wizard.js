// ============================================================
// PriceNest - Location Wizard Logic
// Drives: Country → State → City/Town → Area Type
// Integrates with inflation.js and predict.js
// ============================================================

// ── State ────────────────────────────────────────────────────
var locState = {
  countryCode:  "",
  countryName:  "",
  stateCode:    "",
  stateName:    "",
  cityName:     "",
  areaType:     "",          // urban | semi-urban | rural
  currencyCode:   "USD",
  currencySymbol: "$",
  currencyRate:   1,
  pinCode:        "",
  cityMode:       "drop"     // drop | pin
};

// ── Init: populate country dropdown ──────────────────────────
(function initCountryDropdown() {
  var sel = document.getElementById("countrySelect");
  if (!sel || typeof LOCATION_DATA === "undefined") return;

  Object.keys(LOCATION_DATA).sort(function(a,b) {
    return LOCATION_DATA[a].name.localeCompare(LOCATION_DATA[b].name);
  }).forEach(function(code) {
    var opt = document.createElement("option");
    opt.value = code;
    opt.textContent = LOCATION_DATA[code].name;
    sel.appendChild(opt);
  });
})();

// ── Step 1: Country chosen ────────────────────────────────────
function onCountryChange() {
  var code = document.getElementById("countrySelect").value;
  if (!code) return;

  var country = LOCATION_DATA[code];
  locState.countryCode    = code;
  locState.countryName    = country.name;
  locState.currencyCode   = country.currency;
  locState.currencySymbol = country.symbol;
  locState.currencyRate   = country.rate;
  locState.stateCode      = "";
  locState.stateName      = "";
  locState.cityName       = "";
  locState.areaType       = "";

  // Update income currency label
  var lbl = document.getElementById("incomeCurrencyLabel");
  if (lbl) lbl.textContent = country.symbol;

  // Expose to predict.js globals
  window.currentCurrencyCode   = country.currency;
  window.currentCurrencySymbol = country.symbol;
  window.currentCurrencyRate   = country.rate;
  window.currentCountryName    = country.name;

  // Fetch inflation for this country
  if (typeof fetchInflationRate === "function") {
    // Set the old country select too so inflation.js works
    var oldSel = document.getElementById("countrySelectOld");
    if (oldSel) oldSel.value = code;
    fetchInflationRateForCode(code);
  }

  // Populate states
  var stateSel = document.getElementById("stateSelect");
  stateSel.innerHTML = '<option value="">-- Choose State / Region --</option>';
  Object.keys(country.states).sort(function(a,b) {
    return country.states[a].name.localeCompare(country.states[b].name);
  }).forEach(function(sc) {
    var opt = document.createElement("option");
    opt.value = sc;
    opt.textContent = country.states[sc].name;
    stateSel.appendChild(opt);
  });
  stateSel.disabled = false;

  // Show step 2
  document.getElementById("stepState").style.display = "block";
  document.getElementById("stepCity").style.display  = "none";
  document.getElementById("stepAreaType").style.display = "none";
  hideLocationChip();
  setStepPill(2);
}

// ── Step 2: State chosen ──────────────────────────────────────
function onStateChange() {
  var sc  = document.getElementById("stateSelect").value;
  if (!sc) return;
  var country = LOCATION_DATA[locState.countryCode];
  var state   = country.states[sc];

  locState.stateCode = sc;
  locState.stateName = state.name;
  locState.cityName  = "";
  locState.areaType  = "";

  // Populate cities in dropdown mode — show only city names (area type is chosen by user below)
  var citySel = document.getElementById("citySelect");
  citySel.innerHTML = '<option value="">-- Choose City / Town --</option>';
  state.regions.forEach(function(r) {
    var opt = document.createElement("option");
    opt.value = r.name;
    opt.textContent = r.name;
    citySel.appendChild(opt);
  });
  citySel.disabled = false;

  document.getElementById("stepCity").style.display = "block";
  document.getElementById("stepAreaType").style.display = "none";
  hideLocationChip();
  setStepPill(3);
}

// ── Step 3a: City chosen via dropdown ────────────────────────
function onCityChange() {
  var sel = document.getElementById("citySelect");
  var val = sel.value;
  if (!val) return;

  locState.cityName = val;
  locState.areaType = ""; // Reset — user must now pick area type

  // Show area type step and clear previous selection
  document.querySelectorAll(".area-badge").forEach(function(b) {
    b.classList.remove("selected");
  });
  document.getElementById("stepAreaType").style.display = "block";
  hideLocationChip();
  setStepPill(4);
}

// ── Step 3b: City mode toggle ─────────────────────────────────
function setCityMode(mode) {
  locState.cityMode = mode;
  var dropEl  = document.getElementById("cityDropMode");
  var pinEl   = document.getElementById("cityPinMode");
  var dropBtn = document.getElementById("modeDropBtn");
  var pinBtn  = document.getElementById("modePinBtn");

  if (mode === "drop") {
    dropEl.style.display = "block";
    pinEl.style.display  = "none";
    dropBtn.style.background = "var(--lavender-500)";
    dropBtn.style.color      = "white";
    pinBtn.style.background  = "white";
    pinBtn.style.color       = "var(--lavender-500)";
  } else {
    dropEl.style.display = "none";
    pinEl.style.display  = "block";
    pinBtn.style.background = "var(--lavender-500)";
    pinBtn.style.color      = "white";
    dropBtn.style.background = "white";
    dropBtn.style.color      = "var(--lavender-500)";
    // Clear previous pin UI
    hideEl("pinResult"); hideEl("pinError"); hideEl("pinMatches");
  }
}

// ── Step 3b: PIN code lookup ──────────────────────────────────
function onPinInput(val) {
  locState.pinCode = val;
  // Clear previous results when user types
  if (val.length < 3) {
    hideEl("pinResult"); hideEl("pinError"); hideEl("pinMatches");
  }
}

function lookupPin() {
  var pin = (document.getElementById("pinInput").value || "").trim().toUpperCase();
  if (!pin) return;

  var country = LOCATION_DATA[locState.countryCode];
  if (!country || !locState.stateCode) {
    showPinError("Please select Country and State first.");
    return;
  }
  var state = country.states[locState.stateCode];
  var matches = [];

  // Exact or prefix match
  state.regions.forEach(function(r) {
    r.pinPrefixes.forEach(function(pfx) {
      if (pfx && (pin.startsWith(pfx) || pfx.startsWith(pin))) {
        matches.push(r);
      }
    });
  });

  // Remove duplicates
  var seen = {};
  matches = matches.filter(function(r) {
    if (seen[r.name]) return false;
    seen[r.name] = true;
    return true;
  });

  hideEl("pinResult"); hideEl("pinError"); hideEl("pinMatches");

  if (matches.length === 0) {
    // Fuzzy: try just searching all regions in this state
    showPinError("No exact match found for \"" + pin + "\". Try from the list below:");
    showAllRegionsAsFuzzy(state.regions);
    return;
  }

  if (matches.length === 1) {
    // Exact single match — store city, ask user to pick area type
    locState.cityName = matches[0].name;
    locState.pinCode  = pin;
    locState.areaType = "";
    document.querySelectorAll(".area-badge").forEach(function(b) { b.classList.remove("selected"); });
    document.getElementById("stepAreaType").style.display = "block";
    hideLocationChip();
    setStepPill(4);
    showPinSuccess("✅ Found: " + matches[0].name + " — now select the area type below.");
    return;
  }

  // Multiple matches — let user pick
  showPinMatches(matches);
}

function showPinSuccess(msg) {
  var el = document.getElementById("pinResult");
  el.textContent = msg;
  el.style.display = "block";
}

function showPinError(msg) {
  var el = document.getElementById("pinError");
  el.textContent = msg;
  el.style.display = "block";
}

function showPinMatches(regions) {
  var container = document.getElementById("pinMatches");
  container.style.display = "block";
  container.innerHTML = '<div style="font-size:12px;color:var(--gray-500);margin-bottom:6px;">Multiple matches — tap to select:</div>';
  regions.forEach(function(r) {
    var btn = document.createElement("button");
    btn.style.cssText = "display:block;width:100%;text-align:left;padding:7px 10px;margin-bottom:4px;" +
      "border:1.5px solid var(--lavender-200);border-radius:6px;background:white;cursor:pointer;" +
      "font-size:12px;font-weight:600;color:var(--lavender-700);font-family:'Poppins',sans-serif;" +
      "transition:all .15s;";
    btn.textContent = "📍 " + r.name;
    btn.onmouseover = function() { btn.style.borderColor = "var(--lavender-500)"; btn.style.background = "var(--lavender-100)"; };
    btn.onmouseout  = function() { btn.style.borderColor = "var(--lavender-200)"; btn.style.background = "white"; };
    btn.onclick = function() {
      locState.cityName = r.name;
      locState.pinCode  = pin;
      locState.areaType = "";
      document.querySelectorAll(".area-badge").forEach(function(b) { b.classList.remove("selected"); });
      document.getElementById("stepAreaType").style.display = "block";
      hideLocationChip();
      setStepPill(4);
      showPinSuccess("✅ Selected: " + r.name + " — now pick the area type below.");
      hideEl("pinMatches");
      hideEl("pinError");
    };
    container.appendChild(btn);
  });
}

function showAllRegionsAsFuzzy(regions) {
  showPinMatches(regions);
}

// ── Step 4: Area type selection ───────────────────────────────
function setAreaType(type) {
  locState.areaType = type;
  document.querySelectorAll(".area-badge").forEach(function(b) {
    b.classList.toggle("selected", b.dataset.type === type);
  });
  document.getElementById("stepAreaType").style.display = "block";
}

function selectAreaType(type) {
  locState.areaType = type;
  document.querySelectorAll(".area-badge").forEach(function(b) {
    b.classList.toggle("selected", b.dataset.type === type);
  });
  if (locState.cityName) finishLocationStep(type);
}

// ── Finalize location ─────────────────────────────────────────
function finishLocationStep(type) {
  locState.areaType = type || locState.areaType;

  // Build summary chip text
  var info = AREA_TYPE_INFO[locState.areaType] || { label: locState.areaType };
  var chipText =
    locState.countryName + " › " +
    locState.stateName   + " › " +
    locState.cityName    + " · " + info.label;

  document.getElementById("chipText").textContent = "📍 " + chipText;
  var chip = document.getElementById("locationChip");
  chip.style.display = "flex";

  // Expose to predict.js
  window.currentLocationState = {
    countryCode:    locState.countryCode,
    countryName:    locState.countryName,
    stateCode:      locState.stateCode,
    stateName:      locState.stateName,
    cityName:       locState.cityName,
    areaType:       locState.areaType,
    currencyCode:   locState.currencyCode,
    currencySymbol: locState.currencySymbol,
    currencyRate:   locState.currencyRate,
    pinCode:        locState.pinCode
  };
  // Also update legacy globals that predict.js uses
  window.currentCurrencyCode   = locState.currencyCode;
  window.currentCurrencySymbol = locState.currencySymbol;
  window.currentCurrencyRate   = locState.currencyRate;
  window.currentCountryName    = locState.countryName;

  // Populate neighbourhood suggestions if price index has data for this city
  if (typeof updateNeighbourhoodSuggestions === "function") {
    // Pass stateCode so the price index can do a direct key lookup (e.g. "DL", "MH")
    updateNeighbourhoodSuggestions(locState.countryCode, locState.stateCode, locState.cityName);
  }

  setStepPill(4, true); // done
}

// ── Reset location ────────────────────────────────────────────
function resetLocation() {
  locState = {
    countryCode:"", countryName:"", stateCode:"", stateName:"",
    cityName:"", areaType:"", currencyCode:"USD", currencySymbol:"$",
    currencyRate:1, pinCode:"", cityMode:locState.cityMode
  };
  document.getElementById("countrySelect").value = "";
  document.getElementById("stateSelect").innerHTML = '<option value="">-- Choose State --</option>';
  document.getElementById("stateSelect").disabled = true;
  document.getElementById("citySelect").innerHTML  = '<option value="">-- Choose City / Town --</option>';
  document.getElementById("citySelect").disabled   = true;
  document.getElementById("pinInput").value = "";
  document.getElementById("stepState").style.display    = "none";
  document.getElementById("stepCity").style.display     = "none";
  document.getElementById("stepAreaType").style.display = "none";
  hideLocationChip();
  hideEl("pinResult"); hideEl("pinError"); hideEl("pinMatches");
  document.querySelectorAll(".area-badge").forEach(function(b) { b.classList.remove("selected"); });
  setStepPill(1);

  // Reset currency label
  var lbl = document.getElementById("incomeCurrencyLabel");
  if (lbl) lbl.textContent = "$";
  window.currentCurrencyCode   = "USD";
  window.currentCurrencySymbol = "$";
  window.currentCurrencyRate   = 1;
  window.currentCountryName    = "";
  window.currentLocationState  = null;

  // Clear neighbourhood input
  var hoodInput = document.getElementById("neighbourhood");
  if (hoodInput) hoodInput.value = "";
  var hoodGroup = document.getElementById("neighbourhoodGroup");
  if (hoodGroup) hoodGroup.style.display = "none";
}

// ── Step pills ────────────────────────────────────────────────
function setStepPill(activeStep, allDone) {
  for (var i = 1; i <= 4; i++) {
    var pill = document.getElementById("stepPill" + i);
    if (!pill) continue;
    pill.classList.remove("active", "done");
    if (allDone && i < activeStep) {
      pill.classList.add("done");
    } else if (allDone && i === activeStep) {
      pill.classList.add("done");
    } else if (i < activeStep) {
      pill.classList.add("done");
    } else if (i === activeStep) {
      pill.classList.add("active");
    }
  }
}

function hideLocationChip() {
  document.getElementById("locationChip").style.display = "none";
}

// ── Inflation bridge → delegates 100% to inflation.js ────────
//
// inflation.js's fetchInflationRate() reads countrySelect.value,
// then hits World Bank + exchangerate-api and writes to the
// globals: currentInflationRate, currentCurrencyRate,
//          currentCurrencySymbol, currentCurrencyCode,
//          currentCountryName, inflationYear
//
// We just set countrySelect.value to the chosen code and call it.
// No duplicate logic here — inflation.js owns all of this.
function fetchInflationRateForCode(code) {
  var sel = document.getElementById("countrySelect");
  if (sel) sel.value = code;               // sync the select so inflation.js reads correctly
  if (typeof fetchInflationRate === "function") {
    fetchInflationRate();                   // ← the real one from inflation.js
  }
}

// ── Location banner in results ────────────────────────────────
function showLocationBanner() {
  if (!locState.countryName) return;
  var banner = document.getElementById("locationBanner");
  if (!banner) return;
  var info = AREA_TYPE_INFO[locState.areaType] || {};
  document.getElementById("bannerCountry").textContent  = locState.countryName;
  document.getElementById("bannerState").textContent    = locState.stateName;
  document.getElementById("bannerCity").textContent     = locState.cityName;
  document.getElementById("bannerAreaType").textContent = info.label || locState.areaType;
  banner.style.display = "flex";
}

// Patch predict.js's displayResults to also show location banner
var _origDisplayResults = window.displayResults;
window.displayResults = function(data, inflRate, currCode, currSymbol, currRate, cntry) {
  if (_origDisplayResults) _origDisplayResults(data, inflRate, currCode, currSymbol, currRate, cntry);
  showLocationBanner();
};

// ── Patch runPrediction to inject location data ───────────────
var _origRunPrediction = window.runPrediction;
window.runPrediction = function() {
  // Inject location into what predict.js reads
  if (window.currentLocationState) {
    window.currentCurrencyCode   = locState.currencyCode;
    window.currentCurrencySymbol = locState.currencySymbol;
    window.currentCurrencyRate   = locState.currencyRate;
    window.currentCountryName    = locState.countryName;
  }
  if (_origRunPrediction) _origRunPrediction();
};

// Also patch the fetch payload to include location fields
// by overriding the body stringify inside predict.js via monkey-patching fetch
(function patchFetch() {
  var _origFetch = window.fetch;
  window.fetch = function(url, options) {
    if (url && url.includes("/api/predict") && options && options.body) {
      try {
        var body = JSON.parse(options.body);
        if (window.currentLocationState) {
          body.state       = locState.stateName;
          body.state_code  = locState.stateCode;
          body.city        = locState.cityName;
          body.area_type   = locState.areaType;
          body.pin_code    = locState.pinCode;
        }
        options.body = JSON.stringify(body);
      } catch(e) {}
    }
    return _origFetch.apply(this, arguments);
  };
})();

// ── Helpers ───────────────────────────────────────────────────
function hideEl(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = "none";
}
// NOTE: onManualInflationInput() is defined in inflation.js — do not redefine here.
