# 🏠 PriceNest - House Price Prediction Platform
**"Know your home's true worth."**

---

## 📁 Project Structure

```
PriceNest/
├── backend/
│   ├── ml_model.py          ← Train all 4 ML models (run this first!)
│   ├── app.py               ← Flask API server
│   ├── requirements.txt     ← Python packages needed
│   └── housing.csv          ← Dataset (copy here from uploads)
│
└── frontend/
    ├── pages/
    │   ├── home.html        ← Home page
    │   ├── about.html       ← About page
    │   ├── auth.html        ← Login / Sign Up page
    │   ├── predict.html     ← Prediction page (login required)
    │   ├── history.html     ← Search history (login required)
    │   ├── report.html      ← Report generation (login required)
    │   └── admin.html       ← Admin dashboard (admin only)
    ├── css/
    │   ├── style.css        ← Global lavender styles
    │   ├── auth.css         ← Auth page styles
    │   ├── home.css         ← Home page styles
    │   ├── predict.css      ← Prediction page styles
    │   └── report.css       ← Report page styles
    └── js/
        ├── utils.js         ← Shared utilities (API calls, auth)
        ├── auth.js          ← Login/signup logic
        ├── home.js          ← Home page logic
        ├── about.js         ← About page logic
        ├── predict.js       ← Prediction logic
        ├── history.js       ← History page logic
        ├── admin.js         ← Admin dashboard logic
        └── report.js        ← Report generation logic
```

---

## 🚀 Setup Instructions (Step by Step)

### Step 1: Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Start MongoDB: `mongod` (in a terminal)

### Step 2: Set up Python Backend
```bash
cd PriceNest/backend

# Install required packages
pip install -r requirements.txt

# Copy your dataset here
cp /path/to/housing.csv .

# Train the 4 ML models (creates saved_models/ folder)
python ml_model.py

# Start the Flask server
python app.py
```
Server runs at: http://localhost:5000

### Step 3: Open the Frontend
- Open `frontend/pages/home.html` in your browser
- OR use VS Code Live Server extension for best results

---

## 🧠 Machine Learning Models Used

| Algorithm | Type | Description |
|-----------|------|-------------|
| Linear Regression | Regression | Simple linear model, baseline |
| Decision Tree | Tree-based | Non-linear, interpretable |
| Random Forest | Ensemble | 100 trees, very accurate |
| Gradient Boosting | Boosting | Sequential error correction |

**Metrics calculated:**
- **Accuracy** (R² score × 100)
- **Precision** (% predictions within 10% of actual price)
- **F-Score** (harmonic mean of precision & recall)
- **RMSE** (Root Mean Squared Error in $)

---

## 🌐 Pages & Access

| Page | Who Can Access |
|------|---------------|
| Home | Everyone (no login) |
| About | Everyone (no login) |
| Login/Signup | Everyone |
| Predict | Logged-in users |
| History | Logged-in users |
| Report | Logged-in users |
| Admin Dashboard | Admin only |

---

## 🗄️ MongoDB Collections

| Collection | Stores |
|-----------|--------|
| `users` | User accounts (username, email, hashed password, role) |
| `search_history` | Every prediction made by each user |
| `active_sessions` | Who is currently logged in |

---

## 📊 Features

- ✅ 4 ML algorithms compared side by side
- ✅ Rooms & Bedrooms converted to integer automatically
- ✅ MongoDB for all data storage
- ✅ Bcrypt password hashing (secure)
- ✅ Admin dashboard (active users, all searches)
- ✅ Search history with clear option
- ✅ Report generation with print/download
- ✅ Lavender color theme throughout
- ✅ Fully responsive design
- ✅ Login as User OR Admin from same page
