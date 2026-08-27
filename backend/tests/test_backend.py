import sys
import os

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "demo_mode" in data

def test_current_weather():
    response = client.get("/api/weather/current?location=Pune")
    assert response.status_code == 200
    data = response.json()
    assert "weather" in data
    assert "risk" in data
    assert data["weather"]["location"] == "Pune, Maharashtra"
    assert data["risk"]["score"] > 0
    assert "breakdown" in data["risk"]

def test_forecast():
    response = client.get("/api/weather/forecast?location=Mumbai")
    assert response.status_code == 200
    data = response.json()
    assert "forecast" in data
    assert len(data["forecast"]) > 0

def test_chat():
    # Test English General query
    response = client.post("/api/chat", json={
        "query": "Will it rain in Pune tomorrow?",
        "role": "general"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer_text" in data
    assert "session_id" in data
    assert data["alert_level"] in ["LOW", "MODERATE", "HIGH", "SEVERE"]

    # Test Farmer Mode Marathi query
    session_id = data["session_id"]
    response2 = client.post("/api/chat", json={
        "query": "उद्या पुण्यात पाऊस पडणार आहे का?",
        "session_id": session_id,
        "role": "farmer",
        "lang": "mr"
    })
    assert response2.status_code == 200
    data2 = response2.json()
    assert "answer_text" in data2

def test_route_analyze():
    response = client.post("/api/route/analyze", json={
        "from_location": "Pune",
        "to_location": "Mumbai"
    })
    assert response.status_code == 200
    data = response.json()
    assert "timeline" in data
    assert len(data["timeline"]) == 5  # Pune, Lonavala, Khopoli, Panvel, Mumbai
    assert "ai_travel_recommendation" in data

def test_alerts():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "alerts" in data
    assert len(data["alerts"]) > 0

def test_disaster():
    response = client.get("/api/disaster/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "critical_zones" in data
    assert "ai_situation_summary" in data

if __name__ == "__main__":
    print("Running WeatherGPT Backend Integration Tests...")
    try:
        test_root()
        print("[OK] Root endpoint working")
        test_current_weather()
        print("[OK] Current weather & risk engine working")
        test_forecast()
        print("[OK] 7-day forecast retrieval working")
        test_chat()
        print("[OK] AI Multilingual Chatbot & Personas working")
        test_route_analyze()
        print("[OK] Weather Route Intelligence working")
        test_alerts()
        print("[OK] Official alerts working")
        test_disaster()
        print("[OK] Disaster Command Center metrics working")
        print("\nAll backend integration tests PASSED successfully!")
    except AssertionError as e:
        print(f"Assertion failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error during tests: {e}")
        sys.exit(1)
