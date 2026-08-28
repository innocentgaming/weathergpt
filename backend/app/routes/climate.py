from fastapi import APIRouter, Query

router = APIRouter(prefix="/climate", tags=["climate"])

CLIMATE_DATA_STORE = {
    "pune": {
        "location": "Pune, Maharashtra",
        "historical_avg_temp": 26.5,
        "historical_avg_rainfall_mm": 722,
        "monthly_averages": [
            {"month": "Jan", "temp_c": 20.5, "rainfall_mm": 2},
            {"month": "Feb", "temp_c": 22.8, "rainfall_mm": 1},
            {"month": "Mar", "temp_c": 26.4, "rainfall_mm": 3},
            {"month": "Apr", "temp_c": 29.8, "rainfall_mm": 12},
            {"month": "May", "temp_c": 30.2, "rainfall_mm": 35},
            {"month": "Jun", "temp_c": 27.5, "rainfall_mm": 165},
            {"month": "Jul", "temp_c": 25.1, "rainfall_mm": 210},
            {"month": "Aug", "temp_c": 24.8, "rainfall_mm": 185},
            {"month": "Sep", "temp_c": 25.3, "rainfall_mm": 130},
            {"month": "Oct", "temp_c": 26.0, "rainfall_mm": 68},
            {"month": "Nov", "temp_c": 23.2, "rainfall_mm": 18},
            {"month": "Dec", "temp_c": 20.8, "rainfall_mm": 5}
        ],
        "yearly_trends": [
            {"year": 2020, "avg_temp": 26.2, "extreme_rain_days": 12, "max_temp": 40.2},
            {"year": 2021, "avg_temp": 26.4, "extreme_rain_days": 15, "max_temp": 40.8},
            {"year": 2022, "avg_temp": 26.7, "extreme_rain_days": 18, "max_temp": 41.5},
            {"year": 2023, "avg_temp": 27.0, "extreme_rain_days": 16, "max_temp": 42.1},
            {"year": 2024, "avg_temp": 27.3, "extreme_rain_days": 21, "max_temp": 42.6},
            {"year": 2025, "avg_temp": 27.5, "extreme_rain_days": 24, "max_temp": 43.0}
        ],
        "anomalies": {
            "temp_anomaly_celsius": "+1.0°C above 30-year mean",
            "rainfall_shift": "+18% intense monsoon spells",
            "summary": "Pune has experienced a gradual +1.0°C warming trend over recent decades, with monsoon rainfall exhibiting higher intensity over shorter spans."
        }
    },
    "mumbai": {
        "location": "Mumbai, Maharashtra",
        "historical_avg_temp": 27.8,
        "historical_avg_rainfall_mm": 2400,
        "monthly_averages": [
            {"month": "Jan", "temp_c": 24.0, "rainfall_mm": 0},
            {"month": "Feb", "temp_c": 24.8, "rainfall_mm": 0},
            {"month": "Mar", "temp_c": 27.2, "rainfall_mm": 0},
            {"month": "Apr", "temp_c": 29.5, "rainfall_mm": 2},
            {"month": "May", "temp_c": 30.8, "rainfall_mm": 12},
            {"month": "Jun", "temp_c": 29.2, "rainfall_mm": 520},
            {"month": "Jul", "temp_c": 27.8, "rainfall_mm": 840},
            {"month": "Aug", "temp_c": 27.5, "rainfall_mm": 580},
            {"month": "Sep", "temp_c": 27.6, "rainfall_mm": 340},
            {"month": "Oct", "temp_c": 28.5, "rainfall_mm": 90},
            {"month": "Nov", "temp_c": 27.0, "rainfall_mm": 10},
            {"month": "Dec", "temp_c": 25.2, "rainfall_mm": 2}
        ],
        "yearly_trends": [
            {"year": 2020, "avg_temp": 27.5, "extreme_rain_days": 18, "max_temp": 38.5},
            {"year": 2021, "avg_temp": 27.8, "extreme_rain_days": 22, "max_temp": 39.0},
            {"year": 2022, "avg_temp": 28.0, "extreme_rain_days": 20, "max_temp": 39.2},
            {"year": 2023, "avg_temp": 28.1, "extreme_rain_days": 25, "max_temp": 39.8},
            {"year": 2024, "avg_temp": 28.3, "extreme_rain_days": 28, "max_temp": 40.1},
            {"year": 2025, "avg_temp": 28.5, "extreme_rain_days": 30, "max_temp": 40.5}
        ],
        "anomalies": {
            "temp_anomaly_celsius": "+0.8°C above 30-year mean",
            "rainfall_shift": "Increased high-tide rainfall surge events",
            "summary": "Mumbai coastal waters reflect urban heat island effect combined with frequent extreme monsoon precipitation events."
        }
    }
}

@router.get("/insights")
def get_climate_insights(location: str = Query("Pune", description="Location name")):
    key = location.lower()
    for k in CLIMATE_DATA_STORE:
        if k in key:
            return CLIMATE_DATA_STORE[k]
    return CLIMATE_DATA_STORE["pune"]
