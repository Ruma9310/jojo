"""
============================================================
PriceNest - House Price Prediction ML Backend
============================================================
Training data comes from MongoDB via db_manager.py:
  • housing_base  — original CSV rows
  • user_samples  — accumulated user prediction inputs

Run:
    python ml_model.py                  # train on all data
    python ml_model.py --csv-only       # skip user samples
    python ml_model.py --retrain-if N   # only retrain if ≥N new user samples
============================================================
"""

import argparse
import os
import json
import warnings
import pickle

import numpy as np
import pandas as pd
from sklearn.ensemble          import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model      import LinearRegression
from sklearn.metrics           import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection   import train_test_split
from sklearn.preprocessing     import StandardScaler
from sklearn.tree              import DecisionTreeRegressor

warnings.filterwarnings("ignore")

# ── Import our DB manager ─────────────────────────────────────
try:
    from db_manager import (
        get_training_dataframe,
        log_training_run,
        get_data_stats,
        seed_from_csv,
    )
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("⚠️  db_manager not found — falling back to CSV-only training")


# ── Data loading ──────────────────────────────────────────────
def load_and_prepare_data(csv_only: bool = False, csv_path: str = "housing.csv") -> pd.DataFrame:
    """
    Load training data preferring MongoDB, falling back to CSV.
    """
    if DB_AVAILABLE and not csv_only:
        try:
            df = get_training_dataframe(include_user_samples=True, min_user_samples=10)
            print(f"✅ Loaded {len(df)} rows from MongoDB")
            return df
        except Exception as e:
            print(f"⚠️  MongoDB load failed ({e}), falling back to CSV")

    # CSV fallback
    df = pd.read_csv(csv_path)
    print(f"📂 Loaded CSV: {df.shape[0]} rows × {df.shape[1]} cols")
    df["Avg. Area Number of Rooms"]    = df["Avg. Area Number of Rooms"].astype(float)
    df["Avg. Area Number of Bedrooms"] = df["Avg. Area Number of Bedrooms"].astype(float)
    return df


def prepare_features(df: pd.DataFrame):
    # All 7 features — new ones fill gracefully if missing
    feature_columns = [
        "Avg. Area Income",
        "Avg. Area House Age",
        "Avg. Area Number of Rooms",
        "Avg. Area Number of Bedrooms",
        "Area Population",
        "House Size (sqft)",        # NEW
        "Property Type Encoded",    # NEW
    ]
    # Graceful fill for datasets that don't have new columns yet
    if "House Size (sqft)" not in df.columns:
        df["House Size (sqft)"] = (df["Avg. Area Number of Rooms"] * 250).clip(lower=400)
    if "Property Type Encoded" not in df.columns:
        df["Property Type Encoded"] = 2   # default: house

    X = df[feature_columns]
    y = df["Price"]
    return X, y, feature_columns


# ── Model training ────────────────────────────────────────────
def train_all_models(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    models_def = {
        "Linear Regression": LinearRegression(),
        "Decision Tree":     DecisionTreeRegressor(random_state=42, max_depth=10),
        "Random Forest":     RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
    }

    results        = {}
    trained_models = {}

    for name, model in models_def.items():
        print(f"\n  Training {name}…")
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)

        r2   = r2_score(y_test, y_pred)
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        mae  = float(mean_absolute_error(y_test, y_pred))

        tolerance = 0.10
        correct   = np.abs((y_pred - y_test) / y_test) <= tolerance
        precision = float(correct.mean())
        recall    = float(correct.sum() / len(y_test))
        f_score   = float(2 * precision * recall / (precision + recall)) \
                    if (precision + recall) > 0 else 0.0

        results[name] = {
            "r2_score":  round(r2 * 100, 2),
            "accuracy":  round(r2 * 100, 2),
            "rmse":      round(rmse, 2),
            "mae":       round(mae, 2),
            "precision": round(precision * 100, 2),
            "f_score":   round(f_score * 100, 2),
        }
        trained_models[name] = model

        print(f"    Accuracy : {results[name]['accuracy']}%")
        print(f"    Precision: {results[name]['precision']}%")
        print(f"    F-Score  : {results[name]['f_score']}%")
        print(f"    RMSE     : ${results[name]['rmse']:,.2f}")

    return results, trained_models, scaler, X_test_scaled, y_test


# ── Best model ────────────────────────────────────────────────
def find_best_model(results: dict) -> str:
    best = max(results, key=lambda x: results[x]["accuracy"])
    print(f"\n  🏆 Best Model: {best} ({results[best]['accuracy']}%)")
    return best


# ── Save artefacts ────────────────────────────────────────────
def save_models(trained_models, scaler, results, feature_columns):
    os.makedirs("saved_models", exist_ok=True)

    for name, model in trained_models.items():
        fname = name.lower().replace(" ", "_") + ".pkl"
        with open(f"saved_models/{fname}", "wb") as f:
            pickle.dump(model, f)
        print(f"  Saved: {fname}")

    with open("saved_models/scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)

    save_data = {
        "results":         results,
        "best_model":      find_best_model(results),
        "feature_columns": feature_columns,
        "trained_at":      pd.Timestamp.now().isoformat(),
    }
    with open("saved_models/model_results.json", "w") as f:
        json.dump(save_data, f, indent=2)

    print("\n  ✅ All models + scaler + metadata saved to saved_models/")


# ── Main ──────────────────────────────────────────────────────
def run_training(csv_only: bool = False):
    print("=" * 60)
    print("PriceNest — Training House Price Prediction Models")
    print("=" * 60)

    # Ensure DB is seeded
    if DB_AVAILABLE and not csv_only:
        try:
            seed_from_csv(force=False)          # no-op if already seeded
        except Exception as e:
            print(f"⚠️  Seed skipped: {e}")

    df = load_and_prepare_data(csv_only=csv_only)
    X, y, feature_columns = prepare_features(df)

    print(f"\n  Features : {feature_columns}")
    print(f"  Samples  : {len(df)}")
    print(f"  Price avg: ${y.mean():,.0f}   std: ${y.std():,.0f}")

    results, trained_models, scaler, _, _ = train_all_models(X, y)
    save_models(trained_models, scaler, results, feature_columns)

    # Log this training run to MongoDB
    if DB_AVAILABLE:
        try:
            best = find_best_model(results)
            log_training_run(
                results=results,
                best_model=best,
                num_rows=len(df),
                source="csv-only" if csv_only else "db-merged",
            )
        except Exception:
            pass

    print("\n" + "=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)
    for name, m in results.items():
        print(f"\n  {name}:")
        print(f"    Accuracy : {m['accuracy']}%")
        print(f"    Precision: {m['precision']}%")
        print(f"    F-Score  : {m['f_score']}%")
        print(f"    RMSE     : ${m['rmse']:,.2f}")

    best = find_best_model(results)
    print(f"\n  ✅ BEST: {best}  (Accuracy: {results[best]['accuracy']}%)")
    return results


# ── Retrain-if-needed helper (called by app.py optionally) ────
def retrain_if_new_samples(threshold: int = 50):
    """
    Retrain only when ≥ `threshold` new user samples have been
    collected since the last training run.
    """
    if not DB_AVAILABLE:
        print("db_manager unavailable — skipping auto-retrain check")
        return False
    stats = get_data_stats()
    user_count = stats.get("user_sample_rows", 0)
    print(f"  User samples: {user_count}  (threshold: {threshold})")
    if user_count >= threshold:
        print("  🔄 Threshold reached — retraining…")
        run_training()
        return True
    return False


# ── CLI ───────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PriceNest ML Training")
    parser.add_argument(
        "--csv-only", action="store_true",
        help="Train on CSV data only (skip user samples from MongoDB)"
    )
    parser.add_argument(
        "--retrain-if", type=int, default=None, metavar="N",
        help="Only retrain if ≥ N new user samples exist"
    )
    args = parser.parse_args()

    if args.retrain_if is not None:
        retrain_if_new_samples(threshold=args.retrain_if)
    else:
        run_training(csv_only=args.csv_only)
