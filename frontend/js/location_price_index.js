// ============================================================
// PriceNest - Location Price Index
// City-level and neighbourhood-level price multipliers
// Base = 1.0 → average US suburban house price (~$250,000)
// All values relative to that baseline.
// ============================================================

const LOCATION_PRICE_INDEX = {

  // ══════════════════════════════════════════════════════════
  // INDIA (IN)
  // ══════════════════════════════════════════════════════════
  "IN": {
    _countryBase: 0.38,   // India baseline vs US
    states: {
      "DL": {             // Delhi NCT
        _stateBase: 1.55, // Delhi premium over India avg
        cities: {
          "Connaught Place":       { base: 2.40, neighbourhoods: {} },
          "New Delhi (Central)":   {
            base: 2.20,
            neighbourhoods: {
              "Lutyen's Delhi":      2.80,
              "Chanakyapuri":        2.60,
              "Diplomatic Enclave":  2.55,
              "Janpath":             2.10,
              "Connaught Place":     2.40
            }
          },
          "South Delhi":           {
            base: 2.10,
            neighbourhoods: {
              "Defence Colony":      2.50,
              "Greater Kailash":     2.40,
              "Hauz Khas":           2.35,
              "Vasant Vihar":        2.45,
              "Saket":               1.90,
              "Malviya Nagar":       1.85,
              "Kalkaji":             1.70,
              "Lajpat Nagar":        1.75,
              "Nehru Place":         1.65,
              "Okhla":               1.40
            }
          },
          "South West Delhi":      {
            base: 1.60,
            neighbourhoods: {
              "Vasant Kunj":         1.95,
              "Palam Vihar":         1.50,
              "Dwarka Sector 1-6":   1.55,
              "Dwarka Sector 7-12":  1.45,
              "Dwarka Sector 13-23": 1.40,
              "Mahipalpur":          1.35,
              "Kapashera":           1.20
            }
          },
          "West Delhi":            {
            base: 1.30,
            neighbourhoods: {
              "Rajouri Garden":      1.60,
              "Punjabi Bagh":        1.65,
              "Janakpuri":           1.50,
              "Tilak Nagar":         1.35,
              "Subhash Nagar":       1.30,
              "Patel Nagar":         1.25,
              "Kirti Nagar":         1.40,
              "Moti Nagar":          1.30,
              "Paschim Vihar":       1.45,
              "Vikaspuri":           1.30
            }
          },
          "North Delhi":           {
            base: 1.20,
            neighbourhoods: {
              "Civil Lines":         1.55,
              "Model Town":          1.45,
              "Kamla Nagar":         1.30,
              "Shakti Nagar":        1.20,
              "Ashok Vihar":         1.35,
              "Sadar Bazaar":        1.10,
              "Burari":              1.00
            }
          },
          "North West Delhi":      {
            base: 1.10,
            neighbourhoods: {
              "Rohini Sector 1-10":  1.30,
              "Rohini Sector 11-22": 1.20,
              "Rohini Sector 23+":   1.10,
              "Pitampura":           1.35,
              "Shalimar Bagh":       1.30,
              "Prashant Vihar":      1.25,
              "Mangolpuri":          0.95,
              "Sultanpuri":          0.88,
              "Budh Vihar":          0.92
            }
          },
          "East Delhi":            {
            base: 1.05,
            neighbourhoods: {
              "Vasundhara Enclave":  1.30,
              "Mayur Vihar Ph 1":    1.35,
              "Mayur Vihar Ph 2":    1.25,
              "Mayur Vihar Ph 3":    1.20,
              "Patparganj":          1.25,
              "Preet Vihar":         1.20,
              "Laxmi Nagar":         1.10,
              "Krishna Nagar":       1.05,
              "Shahdara":            0.95,
              "Gandhi Nagar":        1.00
            }
          },
          "North East Delhi":      {
            base: 0.92,
            neighbourhoods: {
              "Dilshad Garden":      1.10,
              "Nand Nagri":          0.88,
              "Mustafabad":          0.80,
              "Yamuna Vihar":        0.95,
              "Bhajan Pura":         0.85
            }
          },
          "Dwarka (Sector 1-13)":  { base: 1.50, neighbourhoods: {} },
          "Dwarka (Sector 14-23)": { base: 1.38, neighbourhoods: {} },
          "Rohini":                {
            base: 1.22,
            neighbourhoods: {
              "Rohini Sector 1-5":   1.35,
              "Rohini Sector 6-10":  1.28,
              "Rohini Sector 11-16": 1.20,
              "Rohini Sector 17-22": 1.12,
              "Rohini Sector 23+":   1.05
            }
          },
          "Pitampura":             { base: 1.32, neighbourhoods: {
            "Pitampura Main":      1.40,
            "Shalimar Bagh":       1.30,
            "Rohini adjacent":     1.20
          }},
          "Janakpuri":             { base: 1.48, neighbourhoods: {
            "Janakpuri Block A":   1.60,
            "Janakpuri Block B":   1.55,
            "Janakpuri Block C":   1.50,
            "Janakpuri Block D":   1.45,
            "Uttam Nagar":         1.20,
            "Nawada":              1.10
          }},
          "Karol Bagh":            {
            base: 1.42,
            neighbourhoods: {
              "Dev Nagar":           1.55,
              "Karol Bagh Market":   1.50,
              "Arya Samaj Road":     1.45,
              "Pusa Road":           1.40,
              "Shastri Nagar":       1.15,
              "Inderlok":            1.10,
              "Anand Parbat":        1.05,
              "Rani Bagh":           1.00
            }
          },
          "Central Delhi":         {
            base: 1.35,
            neighbourhoods: {
              "Paharganj":           1.20,
              "Daryaganj":           1.30,
              "Chandni Chowk":       1.25,
              "Karol Bagh":          1.42,
              "Shastri Nagar":       1.15,
              "Inderlok":            1.10,
              "Pul Bangash":         1.00,
              "Sadar Bazaar":        1.08
            }
          }
        }
      },
      "MH": {             // Maharashtra
        _stateBase: 1.45,
        cities: {
          "Mumbai":                {
            base: 3.20,
            neighbourhoods: {
              "South Mumbai (Colaba)":  4.50,
              "Nariman Point":          4.80,
              "Bandra West":            4.20,
              "Bandra East":            3.40,
              "Andheri West":           2.80,
              "Andheri East":           2.40,
              "Powai":                  2.60,
              "Juhu":                   3.60,
              "Malad West":             2.20,
              "Malad East":             1.90,
              "Borivali West":          2.00,
              "Borivali East":          1.80,
              "Thane":                  1.70,
              "Navi Mumbai":            1.65,
              "Kharghar":               1.50,
              "Panvel":                 1.30,
              "Mira Road":              1.40,
              "Bhayander":              1.20,
              "Vasai":                  1.15,
              "Dadar":                  3.00,
              "Worli":                  3.80,
              "Lower Parel":            3.50,
              "Goregaon West":          2.30,
              "Goregaon East":          2.10,
              "Mulund":                 1.75,
              "Ghatkopar":              2.00,
              "Chembur":                2.10,
              "Kurla":                  1.85,
              "Vikhroli":               1.70
            }
          },
          "Pune":                  {
            base: 1.80,
            neighbourhoods: {
              "Koregaon Park":       2.60,
              "Kalyani Nagar":       2.40,
              "Baner":               2.20,
              "Balewadi":            2.00,
              "Hinjewadi":           1.90,
              "Kothrud":             2.10,
              "Aundh":               2.15,
              "Wakad":               1.85,
              "Hadapsar":            1.60,
              "Kondhwa":             1.50,
              "Wanowrie":            1.55,
              "Nibm":                1.65,
              "Viman Nagar":         2.00,
              "Kharadi":             1.95,
              "Mundhwa":             1.70,
              "Undri":               1.40,
              "Pisoli":              1.30,
              "Dhankawadi":          1.25,
              "Pimpri":              1.50,
              "Chinchwad":           1.55,
              "Akurdi":              1.45,
              "Bhosari":             1.30
            }
          },
          "Nashik":                { base: 1.10, neighbourhoods: {} },
          "Nagpur":                { base: 1.15, neighbourhoods: {
            "Dharampeth":    1.40,
            "Ramdaspeth":    1.35,
            "Sadar":         1.30,
            "Sitabuldi":     1.25,
            "Manish Nagar":  1.10,
            "Nandanvan":     1.05
          }},
          "Aurangabad":            { base: 1.00, neighbourhoods: {} }
        }
      },
      "KA": {             // Karnataka
        _stateBase: 1.40,
        cities: {
          "Bengaluru":             {
            base: 2.10,
            neighbourhoods: {
              "Koramangala":         2.80,
              "Indiranagar":         2.70,
              "Whitefield":          2.20,
              "Electronic City":     1.80,
              "HSR Layout":          2.40,
              "BTM Layout":          2.20,
              "Jayanagar":           2.30,
              "JP Nagar":            2.10,
              "Banashankari":        1.95,
              "Hebbal":              2.00,
              "Yelahanka":           1.75,
              "Marathahalli":        2.00,
              "Sarjapur Road":       1.90,
              "Bannerghatta Road":   1.85,
              "Kanakapura Road":     1.60,
              "Tumkur Road":         1.55,
              "Rajajinagar":         2.10,
              "Malleshwaram":        2.40,
              "Sadashivanagar":      2.60,
              "Basavanagudi":        2.25,
              "Domlur":              2.30,
              "Brookefield":         2.00,
              "Mahadevapura":        1.80
            }
          },
          "Mysuru":                { base: 1.00, neighbourhoods: {} },
          "Mangaluru":             { base: 0.95, neighbourhoods: {} },
          "Hubballi":              { base: 0.85, neighbourhoods: {} }
        }
      },
      "TN": {             // Tamil Nadu
        _stateBase: 1.25,
        cities: {
          "Chennai":               {
            base: 1.70,
            neighbourhoods: {
              "Adyar":               2.20,
              "Anna Nagar":          2.10,
              "T Nagar":             2.00,
              "Nungambakkam":        2.30,
              "Kilpauk":             2.00,
              "Alwarpet":            2.20,
              "Mylapore":            2.10,
              "Velachery":           1.70,
              "Perungudi":           1.65,
              "Sholinganallur":      1.60,
              "Porur":               1.50,
              "Ambattur":            1.30,
              "Avadi":               1.15,
              "Tambaram":            1.20,
              "Perambur":            1.40,
              "Thoraipakkam":        1.65,
              "OMR":                 1.70
            }
          },
          "Coimbatore":            { base: 1.05, neighbourhoods: {} },
          "Madurai":               { base: 0.90, neighbourhoods: {} },
          "Tiruchirappalli":       { base: 0.80, neighbourhoods: {} }
        }
      },
      "TS": {             // Telangana
        _stateBase: 1.30,
        cities: {
          "Hyderabad":             {
            base: 1.65,
            neighbourhoods: {
              "Jubilee Hills":       2.40,
              "Banjara Hills":       2.50,
              "Gachibowli":          2.20,
              "Hitech City":         2.30,
              "Madhapur":            2.10,
              "Kondapur":            1.95,
              "Manikonda":           1.70,
              "Kokapet":             1.80,
              "Kukatpally":          1.60,
              "Bachupally":          1.45,
              "Kompally":            1.40,
              "Ameerpet":            1.80,
              "SR Nagar":            1.70,
              "Begumpet":            1.90,
              "Secunderabad":        1.75,
              "LB Nagar":            1.40,
              "Uppal":               1.35,
              "Nagole":              1.30,
              "Tolichowki":          1.60
            }
          },
          "Warangal":              { base: 0.80, neighbourhoods: {} }
        }
      },
      "GJ": {             // Gujarat
        _stateBase: 1.10,
        cities: {
          "Ahmedabad":             {
            base: 1.25,
            neighbourhoods: {
              "Satellite":           1.70,
              "Prahlad Nagar":       1.80,
              "Bodakdev":            1.75,
              "Vastrapur":           1.60,
              "South Bopal":         1.50,
              "Gota":                1.35,
              "Nikol":               1.10,
              "Narol":               1.00,
              "Chandkheda":          1.30,
              "Motera":              1.25
            }
          },
          "Surat":                 { base: 1.10, neighbourhoods: {} },
          "Vadodara":              { base: 0.95, neighbourhoods: {} },
          "Rajkot":                { base: 0.90, neighbourhoods: {} }
        }
      },
      "RJ": {             // Rajasthan
        _stateBase: 0.85,
        cities: {
          "Jaipur":                {
            base: 1.10,
            neighbourhoods: {
              "C-Scheme":            1.50,
              "Vaishali Nagar":      1.35,
              "Mansarovar":          1.25,
              "Malviya Nagar":       1.30,
              "Jagatpura":           1.10,
              "Sanganer":            0.95,
              "Sitapura":            1.05,
              "Tonk Road":           1.15,
              "Ajmer Road":          1.00,
              "Sikar Road":          0.90
            }
          },
          "Jodhpur":               { base: 0.80, neighbourhoods: {} },
          "Udaipur":               { base: 0.85, neighbourhoods: {} },
          "Kota":                  { base: 0.75, neighbourhoods: {} }
        }
      },
      "UP": {             // Uttar Pradesh
        _stateBase: 0.75,
        cities: {
          "Noida":                 {
            base: 1.40,
            neighbourhoods: {
              "Noida Sector 18":     1.70,
              "Noida Sector 44":     1.60,
              "Noida Sector 50":     1.55,
              "Noida Sector 62":     1.45,
              "Noida Sector 137":    1.30,
              "Greater Noida West":  1.25,
              "Greater Noida":       1.20,
              "Noida Extension":     1.15
            }
          },
          "Ghaziabad":             {
            base: 1.10,
            neighbourhoods: {
              "Indirapuram":         1.35,
              "Vaishali":            1.30,
              "Vasundhara":          1.25,
              "Raj Nagar Extension": 1.15,
              "Crossings Republik":  1.10,
              "Siddharth Vihar":     1.05,
              "Loni":                0.85
            }
          },
          "Lucknow":               {
            base: 1.00,
            neighbourhoods: {
              "Gomti Nagar":         1.35,
              "Hazratganj":          1.40,
              "Indira Nagar":        1.20,
              "Aliganj":             1.25,
              "Rajajipuram":         1.00,
              "Chinhat":             0.95,
              "Telibagh":            0.90,
              "Vrindavan Yojana":    1.10
            }
          },
          "Kanpur":                { base: 0.85, neighbourhoods: {} },
          "Agra":                  { base: 0.80, neighbourhoods: {} },
          "Varanasi":              { base: 0.78, neighbourhoods: {} },
          "Allahabad":             { base: 0.75, neighbourhoods: {} },
          "Meerut":                { base: 0.82, neighbourhoods: {} }
        }
      },
      "HR": {             // Haryana
        _stateBase: 1.20,
        cities: {
          "Gurugram":              {
            base: 2.00,
            neighbourhoods: {
              "DLF Phase 1":         2.80,
              "DLF Phase 2":         2.70,
              "DLF Phase 3":         2.60,
              "DLF Phase 4":         2.65,
              "DLF Phase 5":         2.50,
              "Golf Course Road":    2.55,
              "Sohna Road":          1.90,
              "NH-48 Corridor":      1.80,
              "Sector 56":           2.00,
              "Sector 57":           1.95,
              "Palam Vihar":         1.60,
              "Dwarka Expressway":   1.85,
              "New Gurgaon":         1.75,
              "Manesar":             1.40,
              "Farrukhnagar":        1.20
            }
          },
          "Faridabad":             { base: 1.10, neighbourhoods: {
            "Sector 15":   1.30,
            "Sector 21C":  1.25,
            "NIT Faridabad": 1.10,
            "Neharpar":    1.05,
            "Ballabhgarh": 0.95
          }},
          "Panipat":               { base: 0.80, neighbourhoods: {} },
          "Ambala":                { base: 0.78, neighbourhoods: {} }
        }
      },
      "PB": {             // Punjab
        _stateBase: 0.90,
        cities: {
          "Chandigarh":            { base: 1.30, neighbourhoods: {
            "Sector 8-11":   1.70,
            "Sector 17":     1.60,
            "Sector 22":     1.50,
            "Sector 35":     1.45,
            "Sector 40-46":  1.35,
            "Mohali":        1.30,
            "Panchkula":     1.20
          }},
          "Ludhiana":              { base: 0.95, neighbourhoods: {} },
          "Amritsar":              { base: 0.90, neighbourhoods: {} },
          "Jalandhar":             { base: 0.82, neighbourhoods: {} }
        }
      },
      "WB": {             // West Bengal
        _stateBase: 0.80,
        cities: {
          "Kolkata":               {
            base: 1.10,
            neighbourhoods: {
              "Salt Lake City":      1.50,
              "New Town":            1.45,
              "Rajarhat":            1.35,
              "Park Street":         1.70,
              "Alipore":             1.80,
              "Ballygunge":          1.65,
              "Tollygunge":          1.30,
              "Behala":              1.10,
              "Dum Dum":             1.00,
              "Barasat":             0.90,
              "Howrah":              0.95,
              "Serampore":           0.85
            }
          },
          "Durgapur":              { base: 0.70, neighbourhoods: {} },
          "Siliguri":              { base: 0.75, neighbourhoods: {} }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // UNITED STATES (US)
  // ══════════════════════════════════════════════════════════
  "US": {
    _countryBase: 1.00,
    states: {
      "CA": {
        _stateBase: 1.80,
        cities: {
          "San Francisco":         {
            base: 3.80,
            neighbourhoods: {
              "Pacific Heights":     5.20,
              "Nob Hill":            4.80,
              "Marina":              4.50,
              "Mission Bay":         4.20,
              "Mission District":    3.60,
              "Tenderloin":          2.80,
              "Outer Richmond":      3.40,
              "Sunset District":     3.20,
              "Castro":              3.90,
              "SOMA":                3.70,
              "Bayview":             2.60,
              "Excelsior":           3.00
            }
          },
          "Los Angeles":           {
            base: 2.80,
            neighbourhoods: {
              "Beverly Hills":       6.00,
              "Bel Air":             7.50,
              "Malibu":              6.50,
              "Santa Monica":        5.00,
              "West Hollywood":      4.50,
              "Silver Lake":         3.80,
              "Echo Park":           3.50,
              "Koreatown":           2.80,
              "Compton":             1.80,
              "Long Beach":          2.20,
              "Pasadena":            3.20,
              "Glendale":            2.90,
              "Burbank":             2.70,
              "Inglewood":           2.20,
              "Culver City":         3.60
            }
          },
          "San Diego":             { base: 2.40, neighbourhoods: {
            "La Jolla":       3.80,
            "Del Mar":        3.60,
            "Pacific Beach":  2.80,
            "North Park":     2.40,
            "Chula Vista":    1.90,
            "El Cajon":       1.70
          }},
          "San Jose":              { base: 2.60, neighbourhoods: {} }
        }
      },
      "NY": {
        _stateBase: 1.60,
        cities: {
          "New York City":         {
            base: 3.50,
            neighbourhoods: {
              "Manhattan (Upper East)": 5.50,
              "Midtown":             5.00,
              "SoHo":                5.20,
              "Tribeca":             5.80,
              "Brooklyn Heights":    4.20,
              "Park Slope":          4.00,
              "Williamsburg":        3.80,
              "Astoria":             3.20,
              "Flushing":            2.80,
              "The Bronx":           2.40,
              "Staten Island":       2.60,
              "Harlem":              3.20,
              "Washington Heights":  2.80,
              "Jamaica":             2.40
            }
          },
          "Buffalo":               { base: 1.00, neighbourhoods: {} }
        }
      },
      "TX": {
        _stateBase: 1.20,
        cities: {
          "Austin":                { base: 2.00, neighbourhoods: {
            "Downtown Austin":   2.80,
            "South Congress":    2.50,
            "East Austin":       2.30,
            "Domain Area":       2.20,
            "Round Rock":        1.70,
            "Pflugerville":      1.60,
            "Cedar Park":        1.80
          }},
          "Dallas":                { base: 1.70, neighbourhoods: {
            "Uptown Dallas":    2.60,
            "Highland Park":    3.50,
            "Plano":            1.90,
            "Frisco":           2.00,
            "McKinney":         1.80,
            "Garland":          1.40,
            "Mesquite":         1.30
          }},
          "Houston":               { base: 1.50, neighbourhoods: {
            "River Oaks":       3.20,
            "Montrose":         2.30,
            "The Woodlands":    2.00,
            "Sugar Land":       1.90,
            "Katy":             1.70,
            "Pearland":         1.60,
            "Humble":           1.30
          }},
          "San Antonio":           { base: 1.20, neighbourhoods: {} }
        }
      },
      "FL": {
        _stateBase: 1.25,
        cities: {
          "Miami":                 { base: 2.40, neighbourhoods: {
            "South Beach":      3.80,
            "Brickell":         3.20,
            "Coral Gables":     3.00,
            "Coconut Grove":    2.80,
            "Little Havana":    2.00,
            "Hialeah":          1.80,
            "North Miami":      1.90
          }},
          "Orlando":               { base: 1.40, neighbourhoods: {} },
          "Tampa":                 { base: 1.35, neighbourhoods: {} },
          "Jacksonville":          { base: 1.10, neighbourhoods: {} }
        }
      },
      "WA": {
        _stateBase: 1.50,
        cities: {
          "Seattle":               { base: 2.50, neighbourhoods: {
            "Capitol Hill":    3.20,
            "Queen Anne":      3.40,
            "Bellevue":        3.00,
            "Redmond":         2.80,
            "Kirkland":        2.70,
            "Renton":          2.10,
            "Kent":            1.80
          }},
          "Spokane":               { base: 1.00, neighbourhoods: {} }
        }
      },
      "IL": {
        _stateBase: 1.10,
        cities: {
          "Chicago":               { base: 1.80, neighbourhoods: {
            "Gold Coast":       3.20,
            "Lincoln Park":     2.80,
            "Wicker Park":      2.40,
            "Logan Square":     2.20,
            "Hyde Park":        1.90,
            "South Side":       1.40,
            "West Side":        1.30,
            "Naperville":       2.00,
            "Evanston":         2.20
          }},
          "Rockford":              { base: 0.80, neighbourhoods: {} }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // UNITED KINGDOM (GB)
  // ══════════════════════════════════════════════════════════
  "GB": {
    _countryBase: 1.30,
    states: {
      "ENG": {
        _stateBase: 1.20,
        cities: {
          "London":                {
            base: 3.50,
            neighbourhoods: {
              "Kensington":        5.80,
              "Chelsea":           5.50,
              "Westminster":       5.20,
              "Mayfair":           7.00,
              "Notting Hill":      5.00,
              "Canary Wharf":      4.20,
              "Shoreditch":        4.00,
              "Hackney":           3.60,
              "Islington":         4.20,
              "Camden":            4.00,
              "Peckham":           3.00,
              "Brixton":           3.20,
              "Croydon":           2.60,
              "Ilford":            2.80,
              "Romford":           2.40
            }
          },
          "Manchester":            { base: 1.60, neighbourhoods: {
            "City Centre":    2.20,
            "Didsbury":       2.00,
            "Salford Quays":  1.90,
            "Stockport":      1.50,
            "Oldham":         1.20
          }},
          "Birmingham":            { base: 1.30, neighbourhoods: {
            "Edgbaston":      1.70,
            "Solihull":       1.80,
            "Sutton Coldfield": 1.65,
            "Handsworth":     1.10,
            "Erdington":      1.05
          }},
          "Leeds":                 { base: 1.20, neighbourhoods: {} },
          "Bristol":               { base: 1.60, neighbourhoods: {} }
        }
      },
      "SCT": {
        _stateBase: 0.90,
        cities: {
          "Edinburgh":             { base: 1.80, neighbourhoods: {
            "New Town":       2.40,
            "Morningside":    2.20,
            "Stockbridge":    2.10,
            "Leith":          1.70,
            "Craigmillar":    1.20
          }},
          "Glasgow":               { base: 1.10, neighbourhoods: {} }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // AUSTRALIA (AU)
  // ══════════════════════════════════════════════════════════
  "AU": {
    _countryBase: 1.10,
    states: {
      "NSW": {
        _stateBase: 1.40,
        cities: {
          "Sydney":                {
            base: 2.80,
            neighbourhoods: {
              "North Shore":      3.60,
              "Eastern Suburbs":  3.80,
              "Inner West":       3.20,
              "Parramatta":       2.20,
              "Blacktown":        1.80,
              "Liverpool":        1.70,
              "Cronulla":         2.80,
              "Manly":            3.50,
              "Bondi":            3.80,
              "Newtown":          3.00,
              "Penrith":          1.60
            }
          },
          "Newcastle":             { base: 1.40, neighbourhoods: {} },
          "Wollongong":            { base: 1.50, neighbourhoods: {} }
        }
      },
      "VIC": {
        _stateBase: 1.30,
        cities: {
          "Melbourne":             {
            base: 2.40,
            neighbourhoods: {
              "Toorak":           3.80,
              "South Yarra":      3.40,
              "Richmond":         3.00,
              "Fitzroy":          3.20,
              "Carlton":          2.80,
              "Brunswick":        2.70,
              "St Kilda":         3.00,
              "Docklands":        2.80,
              "Box Hill":         2.20,
              "Dandenong":        1.70,
              "Frankston":        1.80,
              "Sunshine":         1.90,
              "Footscray":        2.40
            }
          },
          "Geelong":               { base: 1.40, neighbourhoods: {} }
        }
      },
      "QLD": {
        _stateBase: 1.10,
        cities: {
          "Brisbane":              { base: 1.80, neighbourhoods: {
            "New Farm":       2.40,
            "Fortitude Valley": 2.20,
            "South Brisbane":  2.30,
            "Paddington":     2.10,
            "Sunnybank":      1.80,
            "Logan":          1.40
          }},
          "Gold Coast":            { base: 1.70, neighbourhoods: {} },
          "Sunshine Coast":        { base: 1.60, neighbourhoods: {} }
        }
      },
      "WA": {
        _stateBase: 1.10,
        cities: {
          "Perth":                 { base: 1.60, neighbourhoods: {
            "Cottesloe":      2.40,
            "Claremont":      2.20,
            "Subiaco":        2.30,
            "Fremantle":      2.00,
            "Joondalup":      1.60,
            "Rockingham":     1.30
          }}
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // CANADA (CA)
  // ══════════════════════════════════════════════════════════
  "CA": {
    _countryBase: 1.05,
    states: {
      "ON": {
        _stateBase: 1.40,
        cities: {
          "Toronto":               {
            base: 2.80,
            neighbourhoods: {
              "Rosedale":          4.00,
              "Forest Hill":       3.80,
              "Annex":             3.20,
              "Yorkville":         4.20,
              "Scarborough":       2.20,
              "Etobicoke":         2.50,
              "North York":        2.60,
              "Mississauga":       2.30,
              "Brampton":          2.10,
              "Markham":           2.40,
              "Vaughan":           2.50
            }
          },
          "Ottawa":                { base: 1.80, neighbourhoods: {} }
        }
      },
      "BC": {
        _stateBase: 1.60,
        cities: {
          "Vancouver":             {
            base: 3.20,
            neighbourhoods: {
              "West Vancouver":   4.50,
              "Shaughnessy":      4.20,
              "Kitsilano":        3.60,
              "East Van":         3.00,
              "Richmond":         2.80,
              "Surrey":           2.20,
              "Burnaby":          2.60,
              "Langley":          2.10,
              "Abbotsford":       1.70
            }
          },
          "Victoria":              { base: 2.00, neighbourhoods: {} }
        }
      },
      "AB": {
        _stateBase: 1.00,
        cities: {
          "Calgary":               { base: 1.60, neighbourhoods: {
            "Beltline":       2.10,
            "Mount Royal":    2.40,
            "Kensington":     2.20,
            "Airdrie":        1.50,
            "Cochrane":       1.40
          }},
          "Edmonton":              { base: 1.30, neighbourhoods: {} }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // SINGAPORE (SG)
  // ══════════════════════════════════════════════════════════
  "SG": {
    _countryBase: 2.20,
    states: {
      "SG": {
        _stateBase: 1.00,
        cities: {
          "Singapore":             {
            base: 1.00,
            neighbourhoods: {
              "Orchard Road":       2.20,
              "Bukit Timah":        2.10,
              "Sentosa Cove":       3.50,
              "Holland Village":    1.90,
              "Bishan":             1.60,
              "Tampines":           1.40,
              "Jurong East":        1.35,
              "Woodlands":          1.20,
              "Punggol":            1.30,
              "Sengkang":           1.35,
              "Yishun":             1.20,
              "Bedok":              1.45,
              "Pasir Ris":          1.30
            }
          }
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // UAE (AE)
  // ══════════════════════════════════════════════════════════
  "AE": {
    _countryBase: 1.50,
    states: {
      "DXB": {
        _stateBase: 1.30,
        cities: {
          "Dubai":                 {
            base: 1.00,
            neighbourhoods: {
              "Palm Jumeirah":      3.20,
              "Downtown Dubai":     3.00,
              "Dubai Marina":       2.60,
              "JBR":                2.40,
              "Emirates Hills":     3.50,
              "Business Bay":       2.20,
              "JVC":                1.60,
              "Jumeirah Village":   1.70,
              "Deira":              1.40,
              "Bur Dubai":          1.50,
              "Mirdif":             1.60,
              "Al Nahda":           1.35,
              "International City": 1.10
            }
          }
        }
      },
      "AUH": {
        _stateBase: 1.00,
        cities: {
          "Abu Dhabi":             { base: 0.80, neighbourhoods: {
            "Corniche":      1.40,
            "Al Reem Island": 1.60,
            "Al Khalidiyah": 1.30,
            "Khalifa City":  1.20,
            "Mohammed Bin Zayed": 1.10
          }}
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // GERMANY (DE)
  // ══════════════════════════════════════════════════════════
  "DE": {
    _countryBase: 1.20,
    states: {
      "BY": {
        _stateBase: 1.40,
        cities: {
          "Munich":                { base: 2.60, neighbourhoods: {
            "Maxvorstadt":    3.00,
            "Schwabing":      2.90,
            "Bogenhausen":    3.20,
            "Pasing":         2.20,
            "Neuperlach":     1.90
          }}
        }
      },
      "BE": {
        _stateBase: 1.20,
        cities: {
          "Berlin":                { base: 1.80, neighbourhoods: {
            "Mitte":         2.60,
            "Prenzlauer Berg": 2.40,
            "Friedrichshain": 2.20,
            "Kreuzberg":     2.10,
            "Charlottenburg": 2.30,
            "Neukölln":      1.70,
            "Spandau":       1.40
          }}
        }
      },
      "HH": {
        _stateBase: 1.30,
        cities: {
          "Hamburg":               { base: 1.90, neighbourhoods: {
            "Blankenese":    2.60,
            "Eimsbüttel":    2.30,
            "Altona":        2.20,
            "Harburg":       1.60
          }}
        }
      }
    }
  },

  // ══════════════════════════════════════════════════════════
  // SOUTH AFRICA (ZA)
  // ══════════════════════════════════════════════════════════
  "ZA": {
    _countryBase: 0.25,
    states: {
      "WC": {
        _stateBase: 1.40,
        cities: {
          "Cape Town":             { base: 1.00, neighbourhoods: {
            "Atlantic Seaboard":  2.80,
            "City Bowl":          2.20,
            "Southern Suburbs":   1.80,
            "Constantia":         2.60,
            "Bellville":          1.20,
            "Mitchells Plain":    0.70,
            "Khayelitsha":        0.50
          }}
        }
      },
      "GP": {
        _stateBase: 1.20,
        cities: {
          "Johannesburg":          { base: 1.00, neighbourhoods: {
            "Sandton":        2.40,
            "Rosebank":       2.20,
            "Fourways":       1.80,
            "Soweto":         0.60,
            "Alexandra":      0.55,
            "Midrand":        1.50,
            "Roodepoort":     1.00
          }},
          "Pretoria":              { base: 0.90, neighbourhoods: {} }
        }
      }
    }
  }
};

// ── Main lookup function ──────────────────────────────────────
// Returns a price multiplier for the given location.
// Falls back gracefully through: neighbourhood → city → state → country → 1.0
function getLocationPriceMultiplier(countryCode, stateCodeOrName, cityName, neighbourhood, areaType) {
  var countryData = LOCATION_PRICE_INDEX[countryCode];
  if (!countryData) return _areaTypeFallback(areaType);

  var countryBase = countryData._countryBase || 1.0;

  // ── Find state: try exact code match first, then name match ──
  var stateData = null;
  var stateBase = 1.0;
  if (countryData.states && stateCodeOrName) {
    var stateKeys = Object.keys(countryData.states);
    var needle = stateCodeOrName.trim().toUpperCase();

    // 1) Direct code lookup (fastest — "DL", "MH", "CA", etc.)
    if (countryData.states[needle]) {
      stateData = countryData.states[needle];
      stateBase = stateData._stateBase || 1.0;
    }

    // 2) Partial code match (e.g. wizard sends "DL" but index key is "DL")
    if (!stateData) {
      for (var i = 0; i < stateKeys.length; i++) {
        if (stateKeys[i].toUpperCase() === needle) {
          stateData = countryData.states[stateKeys[i]];
          stateBase = stateData._stateBase || 1.0;
          break;
        }
      }
    }

    // 3) Name match fallback (in case full state name was passed)
    if (!stateData) {
      var needleLow = stateCodeOrName.trim().toLowerCase();
      for (var ii = 0; ii < stateKeys.length; ii++) {
        var s = countryData.states[stateKeys[ii]];
        // match against optional s.name OR the comment-style key itself
        var keyLow = stateKeys[ii].toLowerCase();
        if (keyLow === needleLow ||
            (s.name && s.name.toLowerCase() === needleLow) ||
            (s.name && s.name.toLowerCase().includes(needleLow)) ||
            needleLow.includes(keyLow)) {
          stateData = s;
          stateBase = s._stateBase || 1.0;
          break;
        }
      }
    }
  }

  if (!stateData || !stateData.cities) return countryBase * _areaTypeFallback(areaType);

  // ── Find city: exact → partial → substring ───────────────────
  var cityData = null;
  var cityBase  = 1.0;
  if (cityName) {
    var cityKeys = Object.keys(stateData.cities);
    var cn = cityName.trim().toLowerCase();

    // exact match first
    for (var j = 0; j < cityKeys.length; j++) {
      if (cityKeys[j].toLowerCase() === cn) {
        cityData = stateData.cities[cityKeys[j]];
        cityBase = cityData.base || 1.0;
        break;
      }
    }
    // partial match
    if (!cityData) {
      for (var jj = 0; jj < cityKeys.length; jj++) {
        var ck = cityKeys[jj].toLowerCase();
        if (cn.includes(ck) || ck.includes(cn)) {
          cityData = stateData.cities[cityKeys[jj]];
          cityBase = cityData.base || 1.0;
          break;
        }
      }
    }
  }
  if (!cityData) return countryBase * stateBase * _areaTypeFallback(areaType);

  // ── Area type fine-tuning ─────────────────────────────────────
  var areaAdj = _areaTypeAdj(areaType);

  // ── Find neighbourhood: exact → partial → substring ───────────
  if (neighbourhood && cityData.neighbourhoods) {
    var nKeys = Object.keys(cityData.neighbourhoods);
    var nn = neighbourhood.trim().toLowerCase();

    // exact
    for (var k = 0; k < nKeys.length; k++) {
      if (nKeys[k].toLowerCase() === nn) {
        return countryBase * stateBase * cityData.neighbourhoods[nKeys[k]] * areaAdj;
      }
    }
    // partial
    for (var kk = 0; kk < nKeys.length; kk++) {
      var nk = nKeys[kk].toLowerCase();
      if (nn.includes(nk) || nk.includes(nn)) {
        return countryBase * stateBase * cityData.neighbourhoods[nKeys[kk]] * areaAdj;
      }
    }
  }

  // No neighbourhood match — use city base
  return countryBase * stateBase * cityBase * areaAdj;
}

// Area type fine-tuning (on top of location)
function _areaTypeAdj(areaType) {
  var map = { "urban": 1.10, "semi-urban": 0.95, "rural": 0.72 };
  return map[areaType] || 1.00;
}

// Pure area-type fallback when location not in index
function _areaTypeFallback(areaType) {
  var map = { "urban": 1.00, "semi-urban": 0.75, "rural": 0.45 };
  return map[areaType] || 0.75;
}

// ── Get list of neighbourhoods for a city (for UI hints) ─────
function getNeighbourhoods(countryCode, stateCodeOrName, cityName) {
  var countryData = LOCATION_PRICE_INDEX[countryCode];
  if (!countryData || !countryData.states) return [];

  var stateKeys = Object.keys(countryData.states);
  var stateData = null;

  if (stateCodeOrName) {
    var needle = stateCodeOrName.trim().toUpperCase();

    // 1) Direct code lookup
    if (countryData.states[needle]) {
      stateData = countryData.states[needle];
    }

    // 2) Case-insensitive code match
    if (!stateData) {
      for (var i = 0; i < stateKeys.length; i++) {
        if (stateKeys[i].toUpperCase() === needle) {
          stateData = countryData.states[stateKeys[i]];
          break;
        }
      }
    }

    // 3) Name match fallback
    if (!stateData) {
      var needleLow = stateCodeOrName.trim().toLowerCase();
      for (var ii = 0; ii < stateKeys.length; ii++) {
        var s = countryData.states[stateKeys[ii]];
        var keyLow = stateKeys[ii].toLowerCase();
        if (keyLow === needleLow ||
            (s.name && s.name.toLowerCase() === needleLow) ||
            needleLow.includes(keyLow)) {
          stateData = s;
          break;
        }
      }
    }
  }

  if (!stateData || !stateData.cities) return [];

  var cn = (cityName || "").trim().toLowerCase();
  var cityKeys = Object.keys(stateData.cities);

  // exact match first
  for (var j = 0; j < cityKeys.length; j++) {
    if (cityKeys[j].toLowerCase() === cn) {
      return Object.keys(stateData.cities[cityKeys[j]].neighbourhoods || {});
    }
  }
  // partial match
  for (var jj = 0; jj < cityKeys.length; jj++) {
    var ck = cityKeys[jj].toLowerCase();
    if (cn.includes(ck) || ck.includes(cn)) {
      return Object.keys(stateData.cities[cityKeys[jj]].neighbourhoods || {});
    }
  }
  return [];
}
