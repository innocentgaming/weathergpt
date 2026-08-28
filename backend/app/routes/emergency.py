from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/emergency", tags=["emergency"])

EMERGENCY_LOCATIONS_DATA = [
    {
        "id": "loc-1",
        "name": "Sassoon General Hospital & Emergency Care",
        "category": "Hospital",
        "city": "Pune",
        "address": "Near Pune Railway Station, Sangamvadi, Pune",
        "phone": "108 / +91-20-26128000",
        "capacity": "150 beds",
        "lat": 18.5284,
        "lon": 73.8738,
        "is_open_24x7": True,
        "distance_km": "2.4"
    },
    {
        "id": "loc-2",
        "name": "Pune Municipal Disaster Shelter - Shivajinagar",
        "category": "Shelter",
        "city": "Pune",
        "address": "PMC Community Hall, Shivajinagar, Pune",
        "phone": "+91-20-25501000",
        "capacity": "450 people",
        "lat": 18.5314,
        "lon": 73.8446,
        "is_open_24x7": True,
        "distance_km": "3.1"
    },
    {
        "id": "loc-3",
        "name": "NDRF 5th Battalion Rescue Base",
        "category": "Disaster Base",
        "city": "Pune",
        "address": "Sudumbare, Talegaon Dabhade, Pune",
        "phone": "+91-2114-237000 / 1077",
        "capacity": "Specialized Flood Response Team",
        "lat": 18.7180,
        "lon": 73.6820,
        "is_open_24x7": True,
        "distance_km": "24.0"
    },
    {
        "id": "loc-4",
        "name": "KEM Hospital Emergency Unit",
        "category": "Hospital",
        "city": "Pune",
        "address": "Rasta Peth, Pune",
        "phone": "+91-20-66037300",
        "capacity": "90 beds",
        "lat": 18.5204,
        "lon": 73.8640,
        "is_open_24x7": True,
        "distance_km": "1.8"
    },
    {
        "id": "loc-5",
        "name": "Lonavala Hill Rescue & Emergency Center",
        "category": "Disaster Base",
        "city": "Lonavala",
        "address": "Old Mumbai-Pune Highway, Lonavala",
        "phone": "+91-2114-273033",
        "capacity": "Landslide & Torrential Flood Team",
        "lat": 18.7557,
        "lon": 73.4091,
        "is_open_24x7": True,
        "distance_km": "62.0"
    },
    {
        "id": "loc-6",
        "name": "Mumbai Central Relief & Transit Camp",
        "category": "Shelter",
        "city": "Mumbai",
        "address": "BMC Transit School Ground, Dadar West, Mumbai",
        "phone": "1916 / +91-22-24137000",
        "capacity": "800 people",
        "lat": 19.0178,
        "lon": 72.8478,
        "is_open_24x7": True,
        "distance_km": "140.0"
    }
]

EMERGENCY_CHECKLISTS = {
    "flood": {
        "title": "Flood & Heavy Rain Safety Checklist",
        "before": [
            "Charge mobile phones and power banks to 100%.",
            "Keep important documents in waterproof sealed bags.",
            "Identify nearest high-ground emergency shelter.",
            "Store at least 3 days of clean drinking water and non-perishable food."
        ],
        "during": [
            "Do not walk or drive through moving water streams.",
            "Switch off main electrical breakers if water enters the house.",
            "Stay tuned to official WeatherGPT / IMD emergency broadcasts.",
            "Move to top floors if living in low-lying river areas."
        ],
        "emergency_contacts": [
            {"name": "National Disaster Response Force (NDRF)", "number": "1078 / 011-24363260"},
            {"name": "State Disaster Control Room", "number": "1070"},
            {"name": "District Disaster Cell (Pune)", "number": "020-26123371"},
            {"name": "Ambulance Emergency", "number": "108"}
        ]
    },
    "heatwave": {
        "title": "Extreme Heatwave Safety Checklist",
        "before": [
            "Stock oral rehydration salts (ORS), electrolytes, and lemon water.",
            "Cover windows exposed to direct sunlight with blinds or wet curtains.",
            "Plan outdoor agricultural or construction tasks before 10 AM or after 5 PM."
        ],
        "during": [
            "Drink water every 20 minutes even if not feeling thirsty.",
            "Wear loose, light-colored cotton clothing and wide-brimmed hats.",
            "Never leave children or pets inside parked vehicles."
        ],
        "emergency_contacts": [
            {"name": "Heat Stroke Helpline", "number": "108"},
            {"name": "Civic Health Emergency", "number": "104"}
        ]
    },
    "cyclone": {
        "title": "Cyclone & Strong Wind Preparedness",
        "before": [
            "Secure loose roof sheets, solar panels, and outdoor signboards.",
            "Trim overhanging tree branches near power cables.",
            "Keep emergency battery torches and battery radio ready."
        ],
        "during": [
            "Stay indoors away from glass windows and doors.",
            "Do not venture into open sea or coastal beaches.",
            "Watch out for sudden calm (the eye of cyclone); winds will return from opposite direction."
        ],
        "emergency_contacts": [
            {"name": "Coastal Security Control", "number": "1093"},
            {"name": "Police Control Room", "number": "100"}
        ]
    }
}

@router.get("/locations")
def get_emergency_locations(city: Optional[str] = Query(None, description="City name filter")):
    if city:
        filtered = [l for l in EMERGENCY_LOCATIONS_DATA if city.lower() in l["city"].lower()]
        return {"city": city, "locations": filtered if filtered else EMERGENCY_LOCATIONS_DATA}
    return {"city": "All", "locations": EMERGENCY_LOCATIONS_DATA}

@router.get("/checklist")
def get_emergency_checklist(hazard: str = Query("flood", description="Hazard type: flood, heatwave, cyclone")):
    hazard_key = hazard.lower()
    checklist = EMERGENCY_CHECKLISTS.get(hazard_key, EMERGENCY_CHECKLISTS["flood"])
    return checklist
