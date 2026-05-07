"""
============================================================
PriceNest - MongoDB Database Manager
============================================================
Responsibilities:
  1. Seed the database from housing.csv on first run
  2. Store every user prediction input as a training sample
  3. Provide a unified dataset (CSV seed + user inputs) for
     retraining the ML models
  4. Manage data versioning so retraining is incremental

Collections used:
  pricenest.housing_base      — original CSV rows
  pricenest.user_samples      — validated user prediction inputs
  pricenest.training_meta     — tracks retraining runs

Run this file directly to seed the DB:
    python db_manager.py --seed
Or import it in ml_model.py:
    from db_manager import get_training_dataframe
============================================================
"""

import os
import json
import argparse
import warnings
from datetime import datetime

import pandas as pd
import numpy as np
from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError

warnings.filterwarnings("ignore")

# ── Config ────────────────────────────────────────────────────
MONGO_URI   = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME     = "pricenest"
CSV_PATH    = os.getenv("HOUSING_CSV", "housing.csv")

# Feature columns (must match ml_model.py)
FEATURE_COLS = [
    "Avg. Area Income",
    "Avg. Area House Age",
    "Avg. Area Number of Rooms",
    "Avg. Area Number of Bedrooms",
    "Area Population",
    "House Size (sqft)",        # NEW — actual property size
    "Property Type Encoded",    # NEW — apartment=1, house=2, villa=3, plot=0
]
TARGET_COL = "Price"

# Location enrichment multipliers (used when storing user samples)
AREA_TYPE_MULTIPLIERS = {
    "urban":      1.00,
    "semi-urban": 0.75,
    "rural":      0.45,
}

# Property type → numeric encoding for ML
PROPERTY_TYPE_ENCODING = {
    "plot":       0,
    "apartment":  1,
    "house":      2,
    "villa":      3,
}
# Typical sqft size by property type (used to impute CSV rows that have no house_size)
PROPERTY_TYPE_DEFAULT_SQFT = {
    0: 2200,   # plot (land area)
    1: 1100,   # apartment
    2: 1800,   # independent house
    3: 3200,   # villa
}


# ── Connection ────────────────────────────────────────────────
def get_db():
    """Return the pricenest database handle."""
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    return client[DB_NAME]


# ── Seed: CSV → MongoDB ───────────────────────────────────────
def seed_from_csv(csv_path: str = CSV_PATH, force: bool = False) -> dict:
    """
    Load housing.csv into housing_base collection.
    Skips if already seeded unless force=True.

    Returns: {"inserted": N, "skipped": N, "total": N}
    """
    db = get_db()
    col = db["housing_base"]

    # Ensure index for deduplication
    col.create_index([("_csv_row", ASCENDING)], unique=True, background=True)

    if not force and col.count_documents({}) > 0:
        total = col.count_documents({})
        print(f"ℹ️  housing_base already has {total} documents. Use --force to re-seed.")
        return {"inserted": 0, "skipped": total, "total": total}

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV not found at: {csv_path}")

    df = pd.read_csv(csv_path)
    print(f"📂 Loaded CSV: {df.shape[0]} rows × {df.shape[1]} cols")

    # Clean types
    df["Avg. Area Number of Rooms"]    = df["Avg. Area Number of Rooms"].astype(float)
    df["Avg. Area Number of Bedrooms"] = df["Avg. Area Number of Bedrooms"].astype(float)

    if force:
        col.delete_many({})

    inserted = 0
    skipped  = 0
    docs = []
    for i, row in df.iterrows():
        num_rooms = float(row.get("Avg. Area Number of Rooms", 6))
        # Estimate house size from rooms: ~250 sqft per room + small noise
        estimated_sqft = max(400.0, round(num_rooms * 250 + np.random.normal(0, 120), 0))
        doc = {
            "_csv_row":    int(i),
            "_source":     "csv",
            "_seeded_at":  datetime.utcnow(),
            "income":           float(row.get("Avg. Area Income", 0)),
            "house_age":        float(row.get("Avg. Area House Age", 0)),
            "num_rooms":        float(num_rooms),
            "num_bedrooms":     float(row.get("Avg. Area Number of Bedrooms", 0)),
            "population":       float(row.get("Area Population", 0)),
            "house_size":       float(estimated_sqft),          # sqft — estimated from rooms
            "property_type":    "house",                        # CSV rows are all US houses
            "property_type_enc": PROPERTY_TYPE_ENCODING["house"],  # 2
            "price":            float(row.get("Price", 0)),
            "address":          str(row.get("Address", "")),
            "country":    "US",
            "state":      "",
            "city":       "",
            "area_type":  "urban",
            "pin_code":   "",
        }
        docs.append(doc)

    # Bulk insert with ordered=False to skip duplicates gracefully
    if docs:
        try:
            result = col.insert_many(docs, ordered=False)
            inserted = len(result.inserted_ids)
        except Exception as e:
            # Some may be duplicates
            inserted = col.count_documents({"_source": "csv"})

    total = col.count_documents({})
    print(f"✅ Seeded {inserted} rows into housing_base (total: {total})")
    return {"inserted": inserted, "skipped": skipped, "total": total}


# ── Store user prediction input ───────────────────────────────
def store_user_sample(
    username: str,
    email: str,
    income: float,
    house_age: float,
    num_rooms: int,
    num_bedrooms: int,
    population: float,
    best_price: float,
    house_size: float = 0.0,           # NEW — sqft or sqm
    property_type: str = "apartment",  # NEW — apartment/house/villa/plot
    country: str = "",
    state: str = "",
    city: str = "",
    neighbourhood: str = "",
    area_type: str = "",
    pin_code: str = "",
    currency_code: str = "USD",
    currency_rate: float = 1.0,
    inflation_rate: float = None,
    best_model: str = "",
    all_predictions: dict = None,
    loc_multi: float = 1.0,
) -> str:
    """
    Save a user's prediction input to user_samples.
    The predicted best_price is stored as the target label for retraining.

    Returns the inserted document ID as string.
    """
    db  = get_db()
    col = db["user_samples"]

    # Convert predicted price back to USD if needed
    price_usd = best_price / currency_rate if currency_rate > 1 else best_price

    # Encode property type
    prop_enc = PROPERTY_TYPE_ENCODING.get(property_type.lower().strip(), 1)

    # Convert predicted price back to USD if needed
    price_usd = best_price / currency_rate if currency_rate > 1 else best_price

    # Inverse-normalise: strip out loc_multi so stored price is baseline comparable
    multiplier   = AREA_TYPE_MULTIPLIERS.get(area_type, 1.0)
    price_normed = (price_usd / loc_multi) if loc_multi > 0 else price_usd

    doc = {
        "_source":       "user",
        "_username":     username,
        "_email":        email,
        "_created_at":   datetime.utcnow(),
        # ── Core features ──
        "income":        float(income),
        "house_age":     float(house_age),
        "num_rooms":     float(num_rooms),
        "num_bedrooms":  float(num_bedrooms),
        "population":    float(population),
        "house_size":    float(house_size) if house_size else 0.0,
        "property_type":     property_type,
        "property_type_enc": prop_enc,
        # ── Target ──
        "price":         round(float(price_normed), 2),
        "price_raw":     round(float(best_price), 2),
        "price_usd":     round(float(price_usd), 2),
        # ── Location ──
        "country":       country,
        "state":         state,
        "city":          city,
        "neighbourhood": neighbourhood,
        "area_type":     area_type,
        "pin_code":      pin_code,
        "loc_multi":     round(loc_multi, 4),
        # ── Metadata ──
        "currency_code": currency_code,
        "currency_rate": currency_rate,
        "inflation_rate":inflation_rate,
        "best_model":    best_model,
        "all_predictions": all_predictions or {},
        "_weight":       0.3,
    }
    result = col.insert_one(doc)
    return str(result.inserted_id)


# ── Build unified training DataFrame ─────────────────────────
def get_training_dataframe(
    include_user_samples: bool = True,
    min_user_samples: int = 10,
    area_type_filter: str = None,
) -> pd.DataFrame:
    """
    Return a combined DataFrame ready for model training:
      - All rows from housing_base (CSV seed)
      - User samples (if enough collected and include_user_samples=True)

    Columns returned match FEATURE_COLS + [TARGET_COL].

    Parameters
    ----------
    include_user_samples : bool
        Whether to augment with user-entered data.
    min_user_samples : int
        Minimum user samples needed before they are included.
    area_type_filter : str | None
        If set, only include user samples with this area_type.
    """
    db = get_db()

    # ── Load CSV base ──
    base_cursor = db["housing_base"].find(
        {},
        {"income":1,"house_age":1,"num_rooms":1,"num_bedrooms":1,
         "population":1,"house_size":1,"property_type_enc":1,"price":1,"_id":0}
    )
    base_rows = list(base_cursor)
    df_base = pd.DataFrame(base_rows) if base_rows else pd.DataFrame()

    if df_base.empty:
        print("⚠️  housing_base is empty — falling back to CSV file directly")
        if os.path.exists(CSV_PATH):
            df_csv = pd.read_csv(CSV_PATH)
            num_rooms_arr = df_csv["Avg. Area Number of Rooms"].astype(float)
            df_base = pd.DataFrame({
                "income":            df_csv["Avg. Area Income"],
                "house_age":         df_csv["Avg. Area House Age"],
                "num_rooms":         num_rooms_arr,
                "num_bedrooms":      df_csv["Avg. Area Number of Bedrooms"].astype(float),
                "population":        df_csv["Area Population"],
                "house_size":        (num_rooms_arr * 250).clip(lower=400),
                "property_type_enc": 2,   # all CSV rows = house
                "price":             df_csv["Price"],
            })
        else:
            raise RuntimeError("No base data available. Run: python db_manager.py --seed")

    # Fill missing house_size (old seeded rows) with rooms-based estimate
    if "house_size" not in df_base.columns:
        df_base["house_size"] = (df_base.get("num_rooms", 6) * 250).clip(lower=400)
    df_base["house_size"] = df_base["house_size"].fillna(
        df_base.get("num_rooms", pd.Series([6]*len(df_base))) * 250
    ).clip(lower=400)

    if "property_type_enc" not in df_base.columns:
        df_base["property_type_enc"] = 2   # house

    # ── Load user samples ──
    frames = [df_base]

    if include_user_samples:
        query = {"_source": "user"}
        if area_type_filter:
            query["area_type"] = area_type_filter

        user_count = db["user_samples"].count_documents(query)
        if user_count >= min_user_samples:
            user_cursor = db["user_samples"].find(
                query,
                {"income":1,"house_age":1,"num_rooms":1,"num_bedrooms":1,
                 "population":1,"house_size":1,"property_type_enc":1,
                 "price":1,"_weight":1,"_id":0}
            )
            user_rows = list(user_cursor)
            if user_rows:
                df_user = pd.DataFrame(user_rows)
                # Fill missing new fields for older user_sample records
                if "house_size" not in df_user.columns:
                    df_user["house_size"] = df_user.get("num_rooms", 6) * 250
                df_user["house_size"] = df_user["house_size"].fillna(
                    df_user.get("num_rooms", pd.Series([6]*len(df_user))) * 250
                ).clip(lower=400)
                if "property_type_enc" not in df_user.columns:
                    df_user["property_type_enc"] = 1   # default apartment
                frames.append(df_user.drop(columns=["_weight"], errors="ignore"))
                print(f"📊 Added {len(df_user)} user samples to training set")
        else:
            print(f"ℹ️  Only {user_count} user samples (need {min_user_samples}). Skipping user data.")

    df = pd.concat(frames, ignore_index=True)

    # Rename to canonical feature names expected by ml_model.py
    col_map = {
        "income":            "Avg. Area Income",
        "house_age":         "Avg. Area House Age",
        "num_rooms":         "Avg. Area Number of Rooms",
        "num_bedrooms":      "Avg. Area Number of Bedrooms",
        "population":        "Area Population",
        "house_size":        "House Size (sqft)",
        "property_type_enc": "Property Type Encoded",
        "price":             "Price",
    }
    df = df.rename(columns=col_map)

    # Keep only recognised columns that exist
    keep = [c for c in col_map.values() if c in df.columns]
    df = df[keep]

    # Final type enforcement
    df["Avg. Area Number of Rooms"]    = df["Avg. Area Number of Rooms"].astype(float)
    df["Avg. Area Number of Bedrooms"] = df["Avg. Area Number of Bedrooms"].astype(float)
    df["House Size (sqft)"]            = df["House Size (sqft)"].astype(float)
    df["Property Type Encoded"]        = df["Property Type Encoded"].astype(int)
    df = df.dropna().reset_index(drop=True)

    print(f"📦 Training DataFrame: {df.shape[0]} rows × {df.shape[1]} cols "
          f"({len(df_base)} base + {df.shape[0] - len(df_base)} user)")
    return df


# ── Training metadata ─────────────────────────────────────────
def log_training_run(results: dict, best_model: str, num_rows: int, source: str = "auto"):
    """Save a record of each retraining run for auditability."""
    db = get_db()
    db["training_meta"].insert_one({
        "trained_at":  datetime.utcnow(),
        "source":      source,
        "num_rows":    num_rows,
        "best_model":  best_model,
        "results":     results,
    })


def get_training_history(limit: int = 20) -> list:
    """Return the last N training run records."""
    db = get_db()
    cursor = db["training_meta"].find(
        {}, {"_id": 0}
    ).sort("trained_at", -1).limit(limit)
    rows = []
    for doc in cursor:
        doc["trained_at"] = str(doc["trained_at"])
        rows.append(doc)
    return rows


# ── Stats helper ─────────────────────────────────────────────
def get_data_stats() -> dict:
    """Quick summary of what's stored."""
    db = get_db()
    base_count  = db["housing_base"].count_documents({})
    user_count  = db["user_samples"].count_documents({})
    train_count = db["training_meta"].count_documents({})

    # Area type breakdown for user samples
    pipeline = [
        {"$group": {"_id": "$area_type", "count": {"$sum": 1}}},
        {"$sort":  {"count": -1}}
    ]
    area_breakdown = {
        doc["_id"] or "unknown": doc["count"]
        for doc in db["user_samples"].aggregate(pipeline)
    }

    # Country breakdown
    pipeline2 = [
        {"$group": {"_id": "$country", "count": {"$sum": 1}}},
        {"$sort":  {"count": -1}},
        {"$limit": 10}
    ]
    country_breakdown = {
        doc["_id"] or "unknown": doc["count"]
        for doc in db["user_samples"].aggregate(pipeline2)
    }

    return {
        "housing_base_rows":   base_count,
        "user_sample_rows":    user_count,
        "training_runs":       train_count,
        "total_training_rows": base_count + user_count,
        "area_type_breakdown": area_breakdown,
        "top_countries":       country_breakdown,
    }


# ── CLI ───────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PriceNest DB Manager")
    parser.add_argument("--seed",   action="store_true", help="Seed DB from housing.csv")
    parser.add_argument("--force",  action="store_true", help="Force re-seed (drops existing rows)")
    parser.add_argument("--stats",  action="store_true", help="Print database stats")
    parser.add_argument("--history",action="store_true", help="Show retraining history")
    parser.add_argument("--csv",    type=str, default=CSV_PATH, help="Path to CSV file")
    args = parser.parse_args()

    if args.seed:
        print("=" * 55)
        print("PriceNest — Seeding MongoDB from CSV")
        print("=" * 55)
        result = seed_from_csv(csv_path=args.csv, force=args.force)
        print(json.dumps(result, indent=2))

    if args.stats:
        print("\n" + "=" * 55)
        print("PriceNest — Database Statistics")
        print("=" * 55)
        stats = get_data_stats()
        print(json.dumps(stats, indent=2))

    if args.history:
        print("\n" + "=" * 55)
        print("PriceNest — Training History (last 20 runs)")
        print("=" * 55)
        history = get_training_history()
        if not history:
            print("No training runs recorded yet.")
        for run in history:
            print(f"\n▸ {run['trained_at']}  [{run['source']}]  rows={run['num_rows']}")
            print(f"  Best: {run['best_model']}")
            for name, m in run.get("results", {}).items():
                print(f"  {name}: acc={m.get('accuracy')}%  rmse=${m.get('rmse'):,.0f}")

    if not any([args.seed, args.stats, args.history]):
        print(__doc__)
        parser.print_help()
