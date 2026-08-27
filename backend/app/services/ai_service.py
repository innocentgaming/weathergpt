import json
import os
import google.generativeai as genai
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.services.weather_service import get_weather, normalize_city_name
from app.services.risk_service import calculate_weather_risk
from app.services.route_service import analyze_route_weather

# Try to initialize Gemini API
GEMINI_AVAILABLE = False
api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
        GEMINI_AVAILABLE = True
    except Exception as e:
        print(f"Error configuring Gemini: {e}")

# Multi-lingual local translation mapping for keywords
KEYWORDS_LANG = {
    "mr": {
        "rain": ["पाऊस", "पावसाची", "पाऊस पडेल"],
        "temp": ["तापमान", "गरम", "थंड"],
        "irrigate": ["पाणी", "सिंचन", "शेती"],
        "travel": ["प्रवास", "रस्ता", "पुणे ते मुंबई"],
        "yes": "होय",
        "no": "नाही",
        "pune": "पुणे",
        "mumbai": "मुंबई"
    },
    "hi": {
        "rain": ["बारिश", "पानी", "वर्षा"],
        "temp": ["तापमान", "गर्मी", "ठंड"],
        "irrigate": ["सिंचाई", "पानी", "खेती"],
        "travel": ["यात्रा", "सफर", "रास्ता", "पुणे से मुंबई"],
        "yes": "हाँ",
        "no": "नहीं",
        "pune": "पुणे",
        "mumbai": "मुंबई"
    }
}

# Pre-baked translations for key responses in Demo Mode (when API is offline/no key)
LOCAL_TRANSLATED_RESPONSES = {
    "en": {
        "rain_yes_pune": "Yes, heavy rain is expected in Pune today and tomorrow with a 92% probability. A Red Alert is active between 3 PM and 11 PM.",
        "rain_no_delhi": "No, rain is not expected in Delhi. A severe heatwave is active with temperatures up to 38-39°C. Keep hydrated.",
        "irrigate_yes": "Based on the forecast of no rain, you should irrigate your crops. Keep soil moisture at optimal levels.",
        "irrigate_no_pune": "Rain is expected in Pune within the next 18 hours (92% probability). Based on this, delaying irrigation is recommended to prevent waterlogging.",
        "travel_pune_mumbai": "Heavy rainfall is expected around Lonavala (Risk: SEVERE, Landslide risk). Travelling earlier or delaying is highly recommended.",
        "general_fallback": "I have retrieved the weather information for {location}. Current temperature is {temp}°C, condition is {cond}, humidity is {hum}%, and the risk level is {risk_lvl} ({risk_score}/100)."
    },
    "hi": {
        "rain_yes_pune": "हाँ, पुणे में आज और कल भारी बारिश की उम्मीद है (92% संभावना)। दोपहर 3 बजे से रात 11 बजे तक रेड अलर्ट सक्रिय है।",
        "rain_no_delhi": "नहीं, दिल्ली में बारिश की उम्मीद नहीं है। वहां 38-39°C तापमान के साथ गंभीर हीटवेव सक्रिय है। पानी पीते रहें।",
        "irrigate_yes": "बारिश न होने के पूर्वानुमान के कारण, आपको अपनी फसलों की सिंचाई करनी चाहिए।",
        "irrigate_no_pune": "पुणे में अगले 18 घंटों में बारिश की संभावना है (92%)। इसलिए, जलभराव से बचने के लिए सिंचाई टालने की सलाह दी जाती है।",
        "travel_pune_mumbai": "लोनावला के आसपास भारी बारिश और भूस्खलन का खतरा (SEVERE) है। यात्रा टालने या जल्दी करने की सलाह दी जाती है।",
        "general_fallback": "मैंने {location} के मौसम की जानकारी प्राप्त की है। वर्तमान तापमान {temp}°C है, मौसम {cond} है, आर्द्रता {hum}% है, और जोखिम स्तर {risk_lvl} ({risk_score}/100) है।"
    },
    "mr": {
        "rain_yes_pune": "होय, पुण्यात आज आणि उद्या मुसळधार पावसाची शक्यता आहे (92% शक्यता). दुपारी 3 ते रात्री 11 दरम्यान रेड अलर्ट जारी केला आहे.",
        "rain_no_delhi": "नाही, दिल्लीत पावसाची शक्यता नाही. तिथे तीव्र उष्णतेची लाट असून तापमान 38-39°C आहे. भरपूर पाणी प्या.",
        "irrigate_yes": "पाऊस पडण्याची शक्यता नसल्यामुळे, तुम्ही तुमच्या पिकांना पाणी दिले पाहिजे.",
        "irrigate_no_pune": "पुण्यात पुढील 18 तासांत पावसाची शक्यता आहे (92% शक्यता). त्यामुळे पिकांना पाणी देणे तूर्तास पुढे ढकलण्याचा सल्ला दिला जातो.",
        "travel_pune_mumbai": "लोणावळ्याभोवती मुसळधार पाऊस आणि दरड कोसळण्याचा धोका (SEVERE) आहे. प्रवास लवकर करणे किंवा पुढे ढकलणे योग्य ठरेल.",
        "general_fallback": "मी {location} ची हवामान माहिती मिळवली आहे. सध्याचे तापमान {temp}°C आहे, हवामान {cond} आहे, आर्द्रता {hum}% आहे, आणि धोका पातळी {risk_lvl} ({risk_score}/100) आहे."
    }
}


def detect_language(query: str) -> str:
    """Detects if user is querying in Marathi, Hindi, or English (basic heuristic)."""
    q_lower = query.lower()
    
    # Marathi checks
    mr_words = ["पाऊस", "पुण्यात", "उद्या", "का", "तापमान", "पिके", "शेतकरी", "प्रवास", "लोणावळा"]
    if any(w in q_lower for w in mr_words):
        return "mr"
        
    # Hindi checks
    hi_words = ["बारिश", "मौसम", "क्या", "कल", "तापमान", "खेती", "सिंचाई", "यात्रा", "रास्ता"]
    if any(w in q_lower for w in hi_words):
        return "hi"
        
    return "en"


def get_local_nlp_response(query: str, db: Session, role: str, lang: str) -> Dict[str, Any]:
    """Generates local high-fidelity NLP response for Demo Mode when Gemini is unavailable."""
    q_lower = query.lower()
    
    # 1. Detect location
    location = "pune"
    for city in ["mumbai", "delhi", "bengaluru", "chennai", "hyderabad", "lonavala", "khopoli", "panvel"]:
        if city in q_lower or (lang in KEYWORDS_LANG and KEYWORDS_LANG[lang].get(city, "") in q_lower):
            location = city
            break

    weather_data = get_weather(db, location)
    risk_data = calculate_weather_risk(weather_data)
    
    # 2. Check Travel intent (Pune to Mumbai or travel safety)
    if "travel" in q_lower or "प्रवास" in q_lower or "यात्रा" in q_lower or "route" in q_lower or ("pune" in q_lower and "mumbai" in q_lower):
        route_data = analyze_route_weather(db, "Pune", "Mumbai")
        ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["travel_pune_mumbai"]
        return {
            "answer_text": ans_text,
            "data_sources": "WeatherGPT Route Risk Analyzer (Demo Mode)",
            "confidence_note": "Rule-based routing engine matching 'travel' intent.",
            "alert_level": route_data["highest_risk_level"],
            "metadata": {
                "type": "route",
                "route_details": route_data
            }
        }

    # 3. Check Crop/Irrigation advisory intent
    is_irrigation_query = any(w in q_lower for w in ["irrigate", "irrigation", "water my crop", "सिंचाई", "पिकाला पाणी", "पाणी देणे"])
    if is_irrigation_query or role == "farmer":
        if location == "pune" or "pune" in q_lower:
            ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["irrigate_no_pune"]
            alert_lvl = "HIGH"
        else:
            ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["irrigate_yes"]
            alert_lvl = "LOW"
            
        return {
            "answer_text": ans_text + " (Persona: Farmer Mode)",
            "data_sources": "IMD Agro-Meteorological Unit Forecast",
            "confidence_note": "Rule-based Agricultural recommendation engine.",
            "alert_level": alert_lvl,
            "metadata": {
                "type": "weather",
                "weather_details": weather_data,
                "risk_details": risk_data
            }
        }

    # 4. Check Rain query
    is_rain_query = any(w in q_lower for w in ["rain", "rainy", "shower", "monsoon", "पाऊस", "बारिश", "वर्षा"])
    if is_rain_query:
        if location == "pune":
            ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["rain_yes_pune"]
            alert_lvl = "SEVERE"
        elif location == "delhi":
            ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["rain_no_delhi"]
            alert_lvl = "SEVERE"
        else:
            rain_prob = weather_data["current"]["rain_probability"]
            if rain_prob > 50:
                ans_text = f"Yes, rain is expected in {weather_data['location']} with a probability of {rain_prob}%."
                alert_lvl = "WATCH"
            else:
                ans_text = f"No, major rain is not expected in {weather_data['location']} today (probability {rain_prob}%)."
                alert_lvl = "LOW"
                
        return {
            "answer_text": ans_text,
            "data_sources": "Local Weather Service API",
            "confidence_note": "Parsed rain inquiry successfully.",
            "alert_level": alert_lvl,
            "metadata": {
                "type": "weather",
                "weather_details": weather_data,
                "risk_details": risk_data
            }
        }

    # 5. General Fallback with coordinates & conditions
    w_curr = weather_data["current"]
    ans_text = LOCAL_TRANSLATED_RESPONSES[lang]["general_fallback"].format(
        location=weather_data["location"],
        temp=w_curr["temp"],
        cond=w_curr["condition"],
        hum=w_curr["humidity"],
        risk_lvl=risk_data["category"],
        risk_score=risk_data["score"]
    )
    
    # Prepend role-specific advice
    if role == "disaster_manager":
        ans_text = f"[DISASTER CENTER ALERT] Level: {risk_data['category']}. Active monitoring in {weather_data['location']}. " + ans_text
    
    return {
        "answer_text": ans_text,
        "data_sources": w_curr["source"],
        "confidence_note": "Rule-based natural language parser fallback.",
        "alert_level": risk_data["category"],
        "metadata": {
            "type": "weather",
            "weather_details": weather_data,
            "risk_details": risk_data
        }
    }


def generate_chat_response(query: str, db: Session, role: str = "general", lang_override: Optional[str] = None) -> Dict[str, Any]:
    """
    Orchestrates the query to Gemini if available, otherwise falls back to local NLP.
    Outputs structured chat packet with grounded data details.
    """
    lang = lang_override or detect_language(query)
    
    if not GEMINI_AVAILABLE:
        # Fallback mode
        return get_local_nlp_response(query, db, role, lang)

    # If Gemini is available, build the prompt grounding in weather data
    # 1. Detect location
    location = "Pune"
    for city in ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Lonavala", "Khopoli", "Panvel"]:
        if city.lower() in query.lower():
            location = city
            break

    weather_data = get_weather(db, location)
    risk_data = calculate_weather_risk(weather_data)
    
    # 2. Build system instructions and persona parameters
    role_instruction = ""
    if role == "farmer":
        role_instruction = (
            "Act as an Agricultural Meteorology Advisory expert. Focus on soil moisture, "
            "irrigation schedules (recommend delaying if heavy rain is forecast), crop protection, "
            "and pesticide application timings. Keep warnings informational, not absolute."
        )
    elif role == "disaster_manager":
        role_instruction = (
            "Act as a Disaster Management Emergency Director. Focus on active warning severity, "
            "waterlogging hotspots, river markers, road blockage hazard indices, and emergency actions. "
            "Be authoritative, clear, and direct."
        )
    else:  # general
        role_instruction = (
            "Act as an AI Weather Assistant for the general public. Provide a summary of current "
            "conditions, forecasts, travel safety, and simple safety measures (e.g. carry umbrella)."
        )

    prompt = f"""
System instructions:
- You are WeatherGPT, a conversational AI weather copilot developed for India Meteorological Department (IMD).
- Translate and answer in the language requested: {lang} (mr = Marathi, hi = Hindi, en = English).
- Ground ALL weather assertions strictly in the provided data.
- NEVER invent weather metrics or alerts.
- Distinguish between observation and forecast.
- Distinguish between official IMD warnings and AI-generated risk scoring.
- Incorporate this Persona guidance: {role_instruction}

Weather Data provided:
{json.dumps(weather_data, indent=2)}

Risk Assessment:
{json.dumps(risk_data, indent=2)}

User Question: "{query}"

Return a response.
"""
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        answer_text = response.text.strip()
        
        return {
            "answer_text": answer_text,
            "data_sources": weather_data["current"]["source"],
            "confidence_note": "Grounded via Gemini 1.5 Flash.",
            "alert_level": risk_data["category"],
            "metadata": {
                "type": "weather",
                "weather_details": weather_data,
                "risk_details": risk_data
            }
        }
    except Exception as e:
        print(f"Gemini generation error: {e}. Falling back to local NLP.")
        return get_local_nlp_response(query, db, role, lang)
