from fastapi import APIRouter, Query

router = APIRouter(prefix="/location", tags=["location"])

LOCATION_REGISTRY = [
    {"name": "Pune", "state": "Maharashtra", "country": "India", "lat": 18.5204, "lon": 73.8567, "type": "City"},
    {"name": "Wagholi", "state": "Maharashtra", "country": "India", "lat": 18.5793, "lon": 73.9822, "type": "Subarea"},
    {"name": "Lonavala", "state": "Maharashtra", "country": "India", "lat": 18.7557, "lon": 73.4091, "type": "Hill Station"},
    {"name": "Mumbai", "state": "Maharashtra", "country": "India", "lat": 19.0760, "lon": 72.8777, "type": "Metropolis"},
    {"name": "Khopoli", "state": "Maharashtra", "country": "India", "lat": 18.7904, "lon": 73.3424, "type": "Town"},
    {"name": "Panvel", "state": "Maharashtra", "country": "India", "lat": 18.9894, "lon": 73.1175, "type": "City"},
    {"name": "Delhi", "state": "Delhi", "country": "India", "lat": 28.7041, "lon": 77.1025, "type": "Capital"},
    {"name": "Bengaluru", "state": "Karnataka", "country": "India", "lat": 12.9716, "lon": 77.5946, "type": "Metropolis"},
    {"name": "Chennai", "state": "Tamil Nadu", "country": "India", "lat": 13.0827, "lon": 80.2707, "type": "Metropolis"},
    {"name": "Hyderabad", "state": "Telangana", "country": "India", "lat": 17.3850, "lon": 78.4867, "type": "Metropolis"}
]

@router.get("/search")
def search_locations(q: str = Query(..., description="Query location text")):
    query = q.strip().lower()
    if not query or query in ["near me", "current location", "my location"]:
        return {"query": q, "resolved": LOCATION_REGISTRY[0], "suggestions": LOCATION_REGISTRY[:4]}
    
    matches = []
    for loc in LOCATION_REGISTRY:
        if query in loc["name"].lower() or query in loc["state"].lower() or loc["name"].lower() in query:
            matches.append(loc)
            
    if matches:
        return {"query": q, "resolved": matches[0], "suggestions": matches}
        
    # Default fallback to Pune if non-matching string
    return {
        "query": q,
        "resolved": {"name": q.capitalize(), "state": "Maharashtra", "country": "India", "lat": 18.5204, "lon": 73.8567, "type": "Resolved Search"},
        "suggestions": LOCATION_REGISTRY[:4]
    }
