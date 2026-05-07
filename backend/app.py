"""
============================================================
PriceNest - Flask Backend (updated)
New in this version:
  • /api/predict now calls db_manager.store_user_sample()
    so every prediction is saved for future model retraining
  • /api/retrain  — admin endpoint to trigger retraining
  • /api/db-stats — shows MongoDB data statistics
============================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import pickle, json, numpy as np, os, bcrypt, warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = MongoClient("mongodb://localhost:27017/")
db = client["pricenest"]
users_col          = db["users"]
search_history_col = db["search_history"]
sessions_col       = db["active_sessions"]

# ── Import db_manager for user sample storage + retraining ───
try:
    from db_manager import store_user_sample, get_data_stats, seed_from_csv
    DB_MANAGER_AVAILABLE = True
    print("✅ db_manager loaded")
except ImportError:
    DB_MANAGER_AVAILABLE = False
    print("⚠️  db_manager not found — user samples won't be saved for retraining")


# ── Model loading ─────────────────────────────────────────────
def load_models():
    models = {}
    for name in ["linear_regression","decision_tree","random_forest","gradient_boosting"]:
        path = f"saved_models/{name}.pkl"
        if os.path.exists(path):
            with open(path,"rb") as f:
                models[name] = pickle.load(f)
    scaler = None
    if os.path.exists("saved_models/scaler.pkl"):
        with open("saved_models/scaler.pkl","rb") as f:
            scaler = pickle.load(f)
    results = {}
    if os.path.exists("saved_models/model_results.json"):
        with open("saved_models/model_results.json","r") as f:
            results = json.load(f).get("results", {})
    return models, scaler, results

try:
    models, scaler, model_results = load_models()
    print(f"✅ Loaded {len(models)} models")
except Exception as e:
    print(f"⚠️  Could not load models: {e}")
    models, scaler, model_results = {}, None, {}


# ── Location Price Index (mirrors frontend location_price_index.js) ──────────
LOCATION_PRICE_INDEX = {
    "IN": {
        "_countryBase": 0.38,
        "states": {
            "DL": { "_stateBase": 1.55, "cities": {
                "Connaught Place":       {"base": 2.40, "hoods": {}},
                "New Delhi (Central)":   {"base": 2.20, "hoods": {"Lutyen's Delhi":2.80,"Chanakyapuri":2.60,"Diplomatic Enclave":2.55,"Janpath":2.10,"Connaught Place":2.40}},
                "South Delhi":           {"base": 2.10, "hoods": {"Defence Colony":2.50,"Greater Kailash":2.40,"Hauz Khas":2.35,"Vasant Vihar":2.45,"Saket":1.90,"Malviya Nagar":1.85,"Kalkaji":1.70,"Lajpat Nagar":1.75,"Nehru Place":1.65,"Okhla":1.40}},
                "South West Delhi":      {"base": 1.60, "hoods": {"Vasant Kunj":1.95,"Dwarka Sector 1-6":1.55,"Dwarka Sector 7-12":1.45,"Dwarka Sector 13-23":1.40,"Mahipalpur":1.35,"Kapashera":1.20}},
                "West Delhi":            {"base": 1.30, "hoods": {"Rajouri Garden":1.60,"Punjabi Bagh":1.65,"Janakpuri":1.50,"Tilak Nagar":1.35,"Subhash Nagar":1.30,"Patel Nagar":1.25,"Kirti Nagar":1.40,"Moti Nagar":1.30,"Paschim Vihar":1.45,"Vikaspuri":1.30}},
                "North Delhi":           {"base": 1.20, "hoods": {"Civil Lines":1.55,"Model Town":1.45,"Kamla Nagar":1.30,"Shakti Nagar":1.20,"Ashok Vihar":1.35,"Sadar Bazaar":1.10,"Burari":1.00}},
                "North West Delhi":      {"base": 1.10, "hoods": {"Rohini Sector 1-10":1.30,"Rohini Sector 11-22":1.20,"Rohini Sector 23+":1.10,"Pitampura":1.35,"Shalimar Bagh":1.30,"Prashant Vihar":1.25,"Mangolpuri":0.95,"Sultanpuri":0.88,"Budh Vihar":0.92}},
                "East Delhi":            {"base": 1.05, "hoods": {"Vasundhara Enclave":1.30,"Mayur Vihar Ph 1":1.35,"Mayur Vihar Ph 2":1.25,"Mayur Vihar Ph 3":1.20,"Patparganj":1.25,"Preet Vihar":1.20,"Laxmi Nagar":1.10,"Krishna Nagar":1.05,"Shahdara":0.95,"Gandhi Nagar":1.00}},
                "North East Delhi":      {"base": 0.92, "hoods": {"Dilshad Garden":1.10,"Nand Nagri":0.88,"Mustafabad":0.80,"Yamuna Vihar":0.95,"Bhajan Pura":0.85}},
                "Dwarka (Sector 1-13)":  {"base": 1.50, "hoods": {}},
                "Dwarka (Sector 14-23)": {"base": 1.38, "hoods": {}},
                "Rohini":                {"base": 1.22, "hoods": {"Rohini Sector 1-5":1.35,"Rohini Sector 6-10":1.28,"Rohini Sector 11-16":1.20,"Rohini Sector 17-22":1.12,"Rohini Sector 23+":1.05}},
                "Pitampura":             {"base": 1.32, "hoods": {}},
                "Janakpuri":             {"base": 1.48, "hoods": {}},
                "Karol Bagh":            {"base": 1.42, "hoods": {"Dev Nagar":1.55,"Karol Bagh Market":1.50,"Arya Samaj Road":1.45,"Pusa Road":1.40,"Shastri Nagar":1.15,"Inderlok":1.10,"Anand Parbat":1.05,"Rani Bagh":1.00}},
                "Central Delhi":         {"base": 1.35, "hoods": {"Paharganj":1.20,"Daryaganj":1.30,"Chandni Chowk":1.25,"Karol Bagh":1.42,"Shastri Nagar":1.15,"Inderlok":1.10,"Pul Bangash":1.00,"Sadar Bazaar":1.08}},
            }},
            "MH": { "_stateBase": 1.45, "cities": {
                "Mumbai":    {"base": 3.20, "hoods": {"South Mumbai (Colaba)":4.50,"Nariman Point":4.80,"Bandra West":4.20,"Bandra East":3.40,"Andheri West":2.80,"Andheri East":2.40,"Powai":2.60,"Malad West":2.10,"Borivali":1.90,"Kandivali":1.85,"Thane":1.60,"Navi Mumbai":1.70,"Mira Road":1.40,"Vasai":1.20,"Worli":3.80,"Dadar":2.50,"Kurla":2.00,"Ghatkopar":2.10,"Mulund":1.95,"Vikhroli":1.80}},
                "Pune":      {"base": 1.80, "hoods": {"Koregaon Park":2.40,"Kalyani Nagar":2.20,"Boat Club Road":2.60,"Baner":2.00,"Kothrud":1.90,"Hadapsar":1.60,"Hinjewadi":1.70,"Wakad":1.65,"Pimple Saudagar":1.55,"Aundh":1.85,"Viman Nagar":1.95,"Kharadi":1.75}},
                "Nashik":    {"base": 0.90, "hoods": {}},
                "Nagpur":    {"base": 0.85, "hoods": {}},
                "Aurangabad": {"base": 0.80, "hoods": {}},
            }},
            "KA": { "_stateBase": 1.20, "cities": {
                "Bangalore": {"base": 2.40, "hoods": {"Whitefield":2.60,"Koramangala":3.00,"Indiranagar":2.80,"HSR Layout":2.70,"Electronic City":2.00,"Sarjapur Road":2.20,"Marathahalli":2.30,"JP Nagar":2.40,"Bannerghatta":1.90,"Yelahanka":1.80,"Hebbal":2.10,"Bellandur":2.20,"Outer Ring Road":2.30,"Jayanagar":2.50,"BTM Layout":2.20,"Wilson Garden":2.30}},
                "Mysore":    {"base": 1.00, "hoods": {}},
                "Mangalore": {"base": 0.95, "hoods": {}},
                "Hubli":     {"base": 0.80, "hoods": {}},
            }},
            "UP": { "_stateBase": 0.75, "cities": {
                "Noida":     {"base": 1.40, "hoods": {"Noida Sector 18":1.70,"Noida Sector 44":1.60,"Noida Sector 50":1.55,"Noida Sector 62":1.45,"Noida Sector 137":1.30,"Greater Noida West":1.25,"Greater Noida":1.20,"Noida Extension":1.15}},
                "Ghaziabad": {"base": 1.10, "hoods": {"Indirapuram":1.35,"Vaishali":1.30,"Vasundhara":1.25,"Raj Nagar Extension":1.15,"Crossings Republik":1.10,"Loni":0.85}},
                "Lucknow":   {"base": 1.00, "hoods": {"Gomti Nagar":1.35,"Hazratganj":1.40,"Indira Nagar":1.20,"Aliganj":1.25,"Rajajipuram":1.00,"Chinhat":0.95,"Telibagh":0.90}},
                "Kanpur":    {"base": 0.85, "hoods": {}},
                "Agra":      {"base": 0.80, "hoods": {}},
                "Varanasi":  {"base": 0.78, "hoods": {}},
                "Meerut":    {"base": 0.82, "hoods": {}},
            }},
            "HR": { "_stateBase": 1.20, "cities": {
                "Gurugram":  {"base": 2.00, "hoods": {"DLF Phase 1":2.80,"DLF Phase 2":2.70,"DLF Phase 3":2.60,"DLF Phase 4":2.65,"DLF Phase 5":2.50,"Golf Course Road":2.55,"Sohna Road":1.90,"Sector 56":2.00,"Sector 57":1.95,"Palam Vihar":1.60,"Dwarka Expressway":1.85,"New Gurgaon":1.75,"Manesar":1.40}},
                "Faridabad": {"base": 1.10, "hoods": {"Sector 15":1.30,"NIT Faridabad":1.10,"Neharpar":1.05,"Ballabhgarh":0.95}},
                "Panipat":   {"base": 0.80, "hoods": {}},
                "Ambala":    {"base": 0.78, "hoods": {}},
            }},
            "TN": { "_stateBase": 1.05, "cities": {
                "Chennai":   {"base": 1.80, "hoods": {"Anna Nagar":2.20,"Adyar":2.40,"Velachery":1.90,"Porur":1.70,"Ambattur":1.50,"Perambur":1.40,"T Nagar":2.10,"Nungambakkam":2.30,"Mylapore":2.00,"Sholinganallur":1.80}},
                "Coimbatore": {"base": 1.00, "hoods": {}},
                "Madurai":   {"base": 0.80, "hoods": {}},
            }},
            "GJ": { "_stateBase": 0.95, "cities": {
                "Ahmedabad": {"base": 1.40, "hoods": {"Vastrapur":1.70,"Satellite":1.80,"Prahlad Nagar":1.75,"Bodakdev":1.85,"SG Highway":1.60,"Chandkheda":1.30,"Naranpura":1.45}},
                "Surat":     {"base": 1.10, "hoods": {}},
                "Vadodara":  {"base": 0.95, "hoods": {}},
                "Rajkot":    {"base": 0.85, "hoods": {}},
            }},
            "RJ": { "_stateBase": 0.82, "cities": {
                "Jaipur":    {"base": 1.20, "hoods": {"Malviya Nagar":1.50,"C-Scheme":1.60,"Vaishali Nagar":1.40,"Mansarovar":1.30,"Jagatpura":1.10}},
                "Udaipur":   {"base": 0.90, "hoods": {}},
                "Jodhpur":   {"base": 0.85, "hoods": {}},
            }},
            "WB": { "_stateBase": 0.80, "cities": {
                "Kolkata":   {"base": 1.10, "hoods": {"Salt Lake City":1.50,"New Town":1.45,"Rajarhat":1.35,"Park Street":1.70,"Alipore":1.80,"Ballygunge":1.65,"Tollygunge":1.30,"Behala":1.10,"Dum Dum":1.00,"Howrah":0.95}},
                "Durgapur":  {"base": 0.70, "hoods": {}},
                "Siliguri":  {"base": 0.75, "hoods": {}},
            }},
            "TS": { "_stateBase": 1.10, "cities": {
                "Hyderabad": {"base": 2.00, "hoods": {"Banjara Hills":3.00,"Jubilee Hills":3.20,"Gachibowli":2.40,"Kondapur":2.20,"Madhapur":2.30,"Hitech City":2.50,"Kukatpally":1.80,"Secunderabad":1.90,"LB Nagar":1.60,"Kompally":1.50}},
                "Warangal":  {"base": 0.75, "hoods": {}},
            }},
        }
    },
    "US": {
        "_countryBase": 1.00,
        "states": {
            "CA": { "_stateBase": 1.80, "cities": {
                "San Francisco": {"base": 3.80, "hoods": {"Pacific Heights":5.20,"Nob Hill":4.80,"Marina":4.50,"Mission Bay":4.20,"Mission District":3.60,"Tenderloin":2.80,"Outer Richmond":3.40,"Sunset District":3.20,"Castro":3.90,"SOMA":3.70,"Bayview":2.60,"Excelsior":3.00}},
                "Los Angeles":   {"base": 2.80, "hoods": {"Beverly Hills":6.00,"Bel Air":7.50,"Malibu":6.50,"Santa Monica":5.00,"West Hollywood":4.50,"Silver Lake":3.80,"Koreatown":2.80,"Compton":1.80,"Long Beach":2.20,"Pasadena":3.20,"Glendale":2.90,"Culver City":3.60}},
                "San Diego":     {"base": 2.40, "hoods": {"La Jolla":3.80,"Downtown":2.60,"Pacific Beach":2.80,"North Park":2.40,"Chula Vista":1.90}},
                "Sacramento":    {"base": 1.40, "hoods": {}},
                "San Jose":      {"base": 3.20, "hoods": {"Willow Glen":3.50,"Almaden":3.20,"Blossom Hill":2.80,"East San Jose":2.20}},
            }},
            "NY": { "_stateBase": 1.60, "cities": {
                "New York City": {"base": 4.50, "hoods": {"Manhattan (Midtown)":7.00,"Upper East Side":6.50,"Upper West Side":6.00,"Tribeca":6.80,"Brooklyn Heights":5.00,"Park Slope":4.80,"Williamsburg":4.50,"Astoria":3.80,"Queens":3.50,"The Bronx":2.80,"Staten Island":2.60}},
                "Buffalo":       {"base": 0.80, "hoods": {}},
                "Albany":        {"base": 0.90, "hoods": {}},
            }},
            "TX": { "_stateBase": 1.10, "cities": {
                "Austin":   {"base": 2.20, "hoods": {"Downtown":3.00,"South Congress":2.80,"Hyde Park":2.60,"East Austin":2.40,"Cedar Park":1.80,"Round Rock":1.70}},
                "Houston":  {"base": 1.60, "hoods": {"River Oaks":3.50,"Montrose":2.40,"Heights":2.20,"Sugar Land":1.80,"Katy":1.60}},
                "Dallas":   {"base": 1.80, "hoods": {"Uptown":2.80,"Highland Park":3.20,"Plano":2.00,"Frisco":1.90,"Irving":1.60}},
            }},
            "FL": { "_stateBase": 1.20, "cities": {
                "Miami":       {"base": 2.80, "hoods": {"South Beach":4.50,"Brickell":3.80,"Coral Gables":3.40,"Coconut Grove":3.20,"Wynwood":3.00,"Little Havana":2.20,"Hialeah":1.80}},
                "Orlando":     {"base": 1.40, "hoods": {"Lake Nona":1.80,"Winter Park":2.00,"Dr Phillips":1.90}},
                "Tampa":       {"base": 1.50, "hoods": {"Hyde Park":2.20,"Davis Islands":2.40,"Ybor City":1.60}},
            }},
            "WA": { "_stateBase": 1.40, "cities": {
                "Seattle":  {"base": 2.60, "hoods": {"Capitol Hill":3.20,"Bellevue":3.00,"Queen Anne":3.10,"Fremont":2.80,"Ballard":2.70,"South Seattle":2.00}},
                "Spokane":  {"base": 0.90, "hoods": {}},
            }},
            "IL": { "_stateBase": 1.10, "cities": {
                "Chicago":  {"base": 2.00, "hoods": {"Lincoln Park":3.00,"Wicker Park":2.80,"River North":3.20,"Hyde Park":2.20,"Evanston":2.40,"Oak Park":2.00}},
                "Naperville": {"base": 1.60, "hoods": {}},
            }},
        }
    },
    "GB": {
        "_countryBase": 1.40,
        "states": {
            "ENG": { "_stateBase": 1.00, "cities": {
                "London":      {"base": 4.00, "hoods": {"Kensington":6.50,"Chelsea":6.20,"Mayfair":7.00,"Notting Hill":5.80,"Islington":4.80,"Shoreditch":4.50,"Hackney":4.00,"Brixton":3.60,"Croydon":2.80,"Ilford":2.60}},
                "Manchester":  {"base": 1.60, "hoods": {"Didsbury":2.20,"Salford":1.60,"Ancoats":1.80,"Trafford":1.90}},
                "Birmingham":  {"base": 1.40, "hoods": {"Edgbaston":1.80,"Solihull":2.00,"Sutton Coldfield":1.90}},
                "Leeds":       {"base": 1.20, "hoods": {}},
                "Bristol":     {"base": 1.60, "hoods": {"Clifton":2.20,"Redland":2.00}},
            }},
        }
    },
    "AU": {
        "_countryBase": 1.10,
        "states": {
            "NSW": { "_stateBase": 1.50, "cities": {
                "Sydney":   {"base": 3.20, "hoods": {"Mosman":4.80,"Double Bay":5.00,"Bondi":4.20,"Surry Hills":3.80,"Parramatta":2.40,"Penrith":1.80,"Liverpool":1.90}},
                "Newcastle": {"base": 1.20, "hoods": {}},
                "Wollongong": {"base": 1.10, "hoods": {}},
            }},
            "VIC": { "_stateBase": 1.30, "cities": {
                "Melbourne": {"base": 2.60, "hoods": {"Toorak":4.50,"South Yarra":3.80,"Fitzroy":3.40,"Carlton":3.20,"St Kilda":3.00,"Richmond":3.10,"Footscray":2.20,"Dandenong":1.80}},
                "Geelong":   {"base": 1.00, "hoods": {}},
            }},
            "QLD": { "_stateBase": 1.10, "cities": {
                "Brisbane":  {"base": 1.80, "hoods": {"New Farm":2.60,"Paddington":2.40,"Fortitude Valley":2.20,"Sunnybank":1.80}},
                "Gold Coast": {"base": 1.60, "hoods": {"Surfers Paradise":2.20,"Broadbeach":2.00}},
            }},
        }
    },
    "SG": {
        "_countryBase": 1.80,
        "states": {
            "SG": { "_stateBase": 1.00, "cities": {
                "Orchard":       {"base": 3.50, "hoods": {}},
                "Marina Bay":    {"base": 4.00, "hoods": {}},
                "Sentosa":       {"base": 4.50, "hoods": {}},
                "Bukit Timah":   {"base": 3.20, "hoods": {}},
                "Tampines":      {"base": 1.60, "hoods": {}},
                "Jurong":        {"base": 1.40, "hoods": {}},
                "Woodlands":     {"base": 1.20, "hoods": {}},
                "Punggol":       {"base": 1.50, "hoods": {}},
            }},
        }
    },
    "AE": {
        "_countryBase": 1.60,
        "states": {
            "DU": { "_stateBase": 1.30, "cities": {
                "Dubai Marina":  {"base": 3.50, "hoods": {}},
                "Downtown Dubai": {"base": 4.00, "hoods": {}},
                "Palm Jumeirah": {"base": 5.00, "hoods": {}},
                "Business Bay":  {"base": 3.20, "hoods": {}},
                "Jumeirah":      {"base": 3.00, "hoods": {}},
                "Deira":         {"base": 1.80, "hoods": {}},
                "Al Qusais":     {"base": 1.40, "hoods": {}},
            }},
            "AD": { "_stateBase": 1.00, "cities": {
                "Abu Dhabi":     {"base": 2.20, "hoods": {}},
                "Khalifa City":  {"base": 1.80, "hoods": {}},
                "Al Reem Island": {"base": 2.60, "hoods": {}},
            }},
        }
    },
}

AREA_TYPE_ADJ = {"urban": 1.10, "semi-urban": 0.95, "rural": 0.72}
AREA_TYPE_FALLBACK = {"urban": 1.00, "semi-urban": 0.75, "rural": 0.45}


def get_location_multiplier(country_code, state_code, city_name, neighbourhood, area_type):
    """
    Returns a float multiplier (e.g. 0.59) representing the location price index.
    Mirrors the logic in location_price_index.js getLocationPriceMultiplier().
    """
    area_adj      = AREA_TYPE_ADJ.get(area_type, 1.00)
    area_fallback = AREA_TYPE_FALLBACK.get(area_type, 0.75)

    country_data = LOCATION_PRICE_INDEX.get(country_code)
    if not country_data:
        return area_fallback

    country_base = country_data.get("_countryBase", 1.0)
    states = country_data.get("states", {})

    # Find state: exact code match first, then case-insensitive
    state_data = states.get(state_code) or states.get(state_code.upper() if state_code else "")
    if not state_data and state_code:
        needle = state_code.strip().upper()
        for k, v in states.items():
            if k.upper() == needle:
                state_data = v
                break
    if not state_data:
        return country_base * area_fallback

    state_base = state_data.get("_stateBase", 1.0)
    cities = state_data.get("cities", {})

    # Find city: exact then partial
    city_data = None
    if city_name:
        cn = city_name.strip().lower()
        # exact
        for k, v in cities.items():
            if k.lower() == cn:
                city_data = v
                break
        # partial
        if not city_data:
            for k, v in cities.items():
                ck = k.lower()
                if cn in ck or ck in cn:
                    city_data = v
                    break

    if not city_data:
        return country_base * state_base * area_fallback

    city_base = city_data.get("base", 1.0)
    hoods = city_data.get("hoods", {})

    # Find neighbourhood: exact then partial
    if neighbourhood and hoods:
        nn = neighbourhood.strip().lower()
        for k, v in hoods.items():
            if k.lower() == nn:
                return country_base * state_base * v * area_adj
        for k, v in hoods.items():
            nk = k.lower()
            if nn in nk or nk in nn:
                return country_base * state_base * v * area_adj

    return country_base * state_base * city_base * area_adj


# ── Auth helpers ──────────────────────────────────────────────
def get_username_from_request():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    role     = data.get("role", "user")
    email    = data.get("email", "")
    if not username:
        username = request.headers.get("X-Username", "").strip()
        role     = request.headers.get("X-Role", "user")
        email    = request.headers.get("X-Email", "")
    return username, role, email


# ── Auth endpoints ────────────────────────────────────────────
@app.route("/api/signup", methods=["POST","OPTIONS"])
def signup():
    if request.method == "OPTIONS": return jsonify({}), 200
    data = request.json or {}
    username = data.get("username","").strip()
    email    = data.get("email","").strip()
    password = data.get("password","")
    role     = data.get("role","user")
    if not username or not email or not password:
        return jsonify({"success":False,"message":"All fields required"}), 400
    if users_col.find_one({"email":email}):
        return jsonify({"success":False,"message":"Email already registered"}), 400
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    users_col.insert_one({"username":username,"email":email,"password":hashed,
                           "role":role,"created_at":datetime.now()})
    return jsonify({"success":True,"message":"Account created!"})


@app.route("/api/login", methods=["POST","OPTIONS"])
def login():
    if request.method == "OPTIONS": return jsonify({}), 200
    data     = request.json or {}
    email    = data.get("email","").strip()
    password = data.get("password","")
    role     = data.get("role","user")
    user = users_col.find_one({"email":email,"role":role})
    if not user:
        return jsonify({"success":False,"message":"Invalid email or role"}), 401
    if not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"success":False,"message":"Wrong password"}), 401
    sessions_col.update_one(
        {"email":email},
        {"$set":{"email":email,"username":user["username"],"role":role,
                 "logged_in_at":datetime.now(),"is_active":True}},
        upsert=True
    )
    return jsonify({"success":True,"username":user["username"],
                    "role":user["role"],"email":email})


@app.route("/api/logout", methods=["POST","OPTIONS"])
def logout():
    if request.method == "OPTIONS": return jsonify({}), 200
    data  = request.json or {}
    email = data.get("email","")
    if email:
        sessions_col.update_one({"email":email},{"$set":{"is_active":False}})
    return jsonify({"success":True})


@app.route("/api/me", methods=["GET","OPTIONS"])
def me():
    if request.method == "OPTIONS": return jsonify({}), 200
    username, role, email = get_username_from_request()
    if username:
        return jsonify({"logged_in":True,"username":username,"role":role,"email":email})
    return jsonify({"logged_in":False})


# ── Predict ───────────────────────────────────────────────────
@app.route("/api/predict", methods=["POST","OPTIONS"])
def predict():
    if request.method == "OPTIONS": return jsonify({}), 200
    data     = request.json or {}
    username = data.get("username","").strip()
    role     = data.get("role","user")
    email    = data.get("email","")
    if not username:
        username = request.headers.get("X-Username","").strip()
        role     = request.headers.get("X-Role","user")
        email    = request.headers.get("X-Email","")
    if not username:
        return jsonify({"success":False,"message":"Not authenticated. Please login again."}), 401
    if not models or scaler is None:
        return jsonify({"success":False,"message":"Models not trained. Run: python ml_model.py"}), 500

    try:
        income       = float(data.get("income", 0))
        house_age    = float(data.get("house_age", 0))
        num_rooms    = int(data.get("num_rooms", 0))
        num_bedrooms = int(data.get("num_bedrooms", 0))
        population   = float(data.get("population", 0))
        house_size   = float(data.get("house_size", 0))     # NEW — sqft
        property_type = str(data.get("property_type", "apartment")).lower().strip()  # NEW

        PROPERTY_TYPE_ENCODING = {"plot":0,"apartment":1,"house":2,"villa":3}
        property_type_enc = PROPERTY_TYPE_ENCODING.get(property_type, 1)

        # If house_size not provided, estimate from rooms (backwards compat)
        if house_size <= 0:
            house_size = max(400.0, num_rooms * 250.0)

        # Build feature vector — length must match what scaler was trained on.
        # If model was trained on 5 features (old), use 5; if 7 (new), use 7.
        n_features = scaler.n_features_in_ if hasattr(scaler, "n_features_in_") else 5
        if n_features >= 7:
            features = np.array([[income, house_age, num_rooms, num_bedrooms,
                                   population, house_size, property_type_enc]])
        else:
            features = np.array([[income, house_age, num_rooms, num_bedrooms, population]])

        scaled = scaler.transform(features)

        model_map = {
            "linear_regression": "Linear Regression",
            "decision_tree":     "Decision Tree",
            "random_forest":     "Random Forest",
            "gradient_boosting": "Gradient Boosting",
        }
        predictions = {}
        for key, display_name in model_map.items():
            if key in models:
                price   = models[key].predict(scaled)[0]
                metrics = model_results.get(display_name, {})
                predictions[display_name] = {
                    "predicted_price": round(float(price), 2),
                    "accuracy":  metrics.get("accuracy", 0),
                    "precision": metrics.get("precision", 0),
                    "f_score":   metrics.get("f_score", 0),
                    "rmse":      metrics.get("rmse", 0),
                }

        best_model = max(predictions, key=lambda x: predictions[x]["accuracy"])
        best_price = predictions[best_model]["predicted_price"]

        # ── Location + currency fields ──
        country         = data.get("country", "")
        state           = data.get("state", "")
        state_code      = data.get("state_code", "")
        city            = data.get("city", "")
        neighbourhood   = data.get("neighbourhood", "")
        area_type       = data.get("area_type", "urban")
        pin_code        = data.get("pin_code", "")
        currency_code   = data.get("currency_code", "USD")
        currency_symbol = data.get("currency_symbol", "$")
        currency_rate   = float(data.get("currency_rate", 1))
        inflation_rate  = data.get("inflation_rate", None)
        inflation_year  = data.get("inflation_year", "")

        # ── Apply location price multiplier ──────────────────────────
        # Map currency code → ISO country code so we can look up the price index
        CURRENCY_TO_COUNTRY = {
            "INR": "IN", "USD": "US", "GBP": "GB", "AUD": "AU",
            "SGD": "SG", "AED": "AE", "CAD": "CA", "EUR": "DE",
            "ZAR": "ZA", "BRL": "BR",
        }
        country_code_for_index = CURRENCY_TO_COUNTRY.get(currency_code, "")

        loc_multi = 1.0
        if country_code_for_index and state_code:
            loc_multi = get_location_multiplier(
                country_code_for_index, state_code, city, neighbourhood, area_type
            )

        # Scale every model's price by the location multiplier
        if loc_multi != 1.0:
            for model_name in predictions:
                predictions[model_name]["predicted_price"] = round(
                    predictions[model_name]["predicted_price"] * loc_multi, 2
                )
                predictions[model_name]["rmse"] = round(
                    predictions[model_name]["rmse"] * loc_multi, 2
                )

        best_price = predictions[best_model]["predicted_price"]

        # Build location note for reason string
        loc_parts = []
        if neighbourhood: loc_parts.append(neighbourhood)
        elif city:        loc_parts.append(city)
        if state:         loc_parts.append(state)
        loc_str  = ", ".join(loc_parts) if loc_parts else ""
        loc_pct  = round((loc_multi - 1) * 100, 1)
        loc_note = ""
        if loc_str and loc_multi != 1.0:
            sign     = "+" if loc_multi >= 1 else ""
            loc_note = f" Location index for {loc_str}: {sign}{loc_pct}% vs baseline."

        # ── Save to search_history (existing collection) ──
        search_history_col.insert_one({
            "username":username,"email":email,
            "income":income,"house_age":house_age,
            "num_rooms":num_rooms,"num_bedrooms":num_bedrooms,
            "population":population,"predictions":predictions,
            "house_size":house_size,"property_type":property_type,
            "best_model":best_model,"best_price":best_price,
            "country":country,"state":state,"city":city,
            "neighbourhood":neighbourhood,
            "area_type":area_type,"pin_code":pin_code,
            "currency_code":currency_code,
            "currency_symbol":currency_symbol,
            "currency_rate":currency_rate,
            "inflation_rate":inflation_rate,
            "inflation_year":inflation_year,
            "loc_multi":round(loc_multi,4),
            "searched_at":datetime.now()
        })

        # ── Save to user_samples for ML retraining ──
        if DB_MANAGER_AVAILABLE:
            try:
                store_user_sample(
                    username=username,
                    email=email,
                    income=income,
                    house_age=house_age,
                    num_rooms=num_rooms,
                    num_bedrooms=num_bedrooms,
                    population=population,
                    best_price=best_price,
                    house_size=house_size,
                    property_type=property_type,
                    country=country,
                    state=state,
                    city=city,
                    neighbourhood=neighbourhood,
                    area_type=area_type,
                    pin_code=pin_code,
                    currency_code=currency_code,
                    currency_rate=currency_rate,
                    inflation_rate=float(inflation_rate) if inflation_rate else None,
                    best_model=best_model,
                    all_predictions=predictions,
                    loc_multi=loc_multi,
                )
            except Exception as e:
                print(f"⚠️  store_user_sample failed: {e}")

        return jsonify({
            "success":True,"predictions":predictions,
            "best_model":best_model,"best_price":best_price,
            "locMulti": round(loc_multi, 4),
            "reason": (
                f"{best_model} achieved the highest accuracy of "
                f"{predictions[best_model]['accuracy']}% on the test dataset."
                + loc_note
            )
        })

    except Exception as e:
        return jsonify({"success":False,"message":str(e)}), 500


# ── History endpoints ─────────────────────────────────────────
@app.route("/api/history", methods=["GET","OPTIONS"])
def get_history():
    if request.method == "OPTIONS": return jsonify({}), 200
    username = request.args.get("username","").strip()
    if not username:
        username = request.headers.get("X-Username","").strip()
    if not username:
        return jsonify({"success":False,"message":"Not authenticated"}), 401
    history = list(search_history_col.find(
        {"username":username},{"_id":0}
    ).sort("searched_at",-1))
    for item in history:
        item["searched_at"] = str(item["searched_at"])
    return jsonify({"success":True,"history":history})


@app.route("/api/history/clear", methods=["DELETE","OPTIONS"])
def clear_history():
    if request.method == "OPTIONS": return jsonify({}), 200
    username = request.headers.get("X-Username","").strip()
    if not username:
        data = request.get_json(silent=True) or {}
        username = data.get("username","")
    if not username:
        return jsonify({"success":False,"message":"Not authenticated"}), 401
    search_history_col.delete_many({"username":username})
    return jsonify({"success":True,"message":"History cleared!"})


# ── Admin dashboard ───────────────────────────────────────────
@app.route("/api/admin/dashboard", methods=["GET","OPTIONS"])
def admin_dashboard():
    if request.method == "OPTIONS": return jsonify({}), 200
    role = request.args.get("role","") or request.headers.get("X-Role","")
    if role != "admin":
        return jsonify({"success":False,"message":"Admin access only"}), 403
    active_users = list(sessions_col.find({"is_active":True,"role":"user"},{"_id":0}))
    all_users    = list(users_col.find({"role":"user"},{"_id":0,"username":1,"email":1,"created_at":1}))
    all_searches = list(search_history_col.find({},{"_id":0}).sort("searched_at",-1).limit(50))
    for x in all_searches: x["searched_at"] = str(x["searched_at"])
    for x in all_users:    x["created_at"]  = str(x["created_at"])
    for x in active_users: x["logged_in_at"]= str(x.get("logged_in_at",""))
    return jsonify({
        "success":True,"total_users":len(all_users),
        "active_users":len(active_users),"active_user_list":active_users,
        "all_users":all_users,"recent_searches":all_searches,
        "total_searches":search_history_col.count_documents({})
    })


# ── Model results ─────────────────────────────────────────────
@app.route("/api/model-results", methods=["GET","OPTIONS"])
def get_model_results():
    if request.method == "OPTIONS": return jsonify({}), 200
    if not model_results:
        return jsonify({"success":False,"message":"Models not trained yet"}), 404
    best_model = max(model_results, key=lambda x: model_results[x]["accuracy"])
    return jsonify({"success":True,"results":model_results,"best_model":best_model})


# ── NEW: DB stats endpoint ────────────────────────────────────
@app.route("/api/db-stats", methods=["GET","OPTIONS"])
def db_stats():
    """Returns statistics about training data in MongoDB."""
    if request.method == "OPTIONS": return jsonify({}), 200
    role = request.args.get("role","") or request.headers.get("X-Role","")
    if role != "admin":
        return jsonify({"success":False,"message":"Admin access only"}), 403
    if not DB_MANAGER_AVAILABLE:
        return jsonify({"success":False,"message":"db_manager not available"}), 500
    try:
        stats = get_data_stats()
        return jsonify({"success":True,"stats":stats})
    except Exception as e:
        return jsonify({"success":False,"message":str(e)}), 500


# ── NEW: Retrain endpoint (admin only) ────────────────────────
@app.route("/api/retrain", methods=["POST","OPTIONS"])
def retrain():
    """
    Trigger model retraining from admin panel.
    Runs ml_model.py as a subprocess so Flask stays responsive.
    """
    if request.method == "OPTIONS": return jsonify({}), 200
    role = request.headers.get("X-Role","")
    if role != "admin":
        return jsonify({"success":False,"message":"Admin access only"}), 403

    import subprocess, sys
    data     = request.json or {}
    csv_only = data.get("csv_only", False)

    try:
        cmd = [sys.executable, "ml_model.py"]
        if csv_only:
            cmd.append("--csv-only")
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        out, _ = proc.communicate(timeout=300)  # 5-min timeout
        if proc.returncode == 0:
            # Reload models in memory
            global models, scaler, model_results
            models, scaler, model_results = load_models()
            return jsonify({"success":True,"message":"Retraining complete!","log":out})
        else:
            return jsonify({"success":False,"message":"Retraining failed","log":out}), 500
    except subprocess.TimeoutExpired:
        return jsonify({"success":False,"message":"Retraining timed out (>5 min)"}), 500
    except Exception as e:
        return jsonify({"success":False,"message":str(e)}), 500


if __name__ == "__main__":
    # Auto-seed DB from CSV on startup if housing_base is empty
    if DB_MANAGER_AVAILABLE:
        try:
            seed_from_csv(force=False)
        except Exception as e:
            print(f"⚠️  Auto-seed skipped: {e}")

    print("🏠 PriceNest Backend — http://localhost:5000")
    app.run(debug=True, port=5000)
