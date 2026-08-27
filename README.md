# WeatherGPT — AI-Powered Weather, Alert & Disaster Management Copilot

WeatherGPT is a production-quality, conversational AI copilot and disaster management dashboard designed for the Ministry of Earth Sciences (MoES) and the India Meteorological Department (IMD). 

It answers three core questions:
1. **What is happening?** (Real-time weather metrics, local warnings, and forecasts)
2. **What does it mean?** (AI risk assessment engine, explaining parameters and topographical vulnerabilities)
3. **What should I do?** (Actionable, role-specific safety recommendations for travelers, farmers, schools, and emergency responders)

## 🌟 Key Features

* **AI Weather Chatbot**: Grounded in real-time meteorological feeds, avoiding AI hallucinations. Supports English, Hindi, and Marathi.
* **Weather Risk Engine**: Calculates a transparent 0-100 risk score and categorizes it (Low, Moderate, High, Severe) with clear factor breakdowns ("Why this risk?").
* **Route Weather Intelligence**: Analyzes travel safety along corridors (e.g. Pune to Mumbai) waypoint-by-waypoint, warning of ghat landslide risks and heavy storms.
* **Disaster Command Center**: A dedicated dashboard for emergency management cells showcasing priority zones, active alerts, and AI tactical summaries.
* **Interactive Live Map**: Leaflet-based map with toggles for temperature, rain, wind, and alert zones.
* **Personalized User Modes**: Mode toggles for General Public, Traveller, Farmer, Disaster Manager, and School/College, altering data focuses and AI personas.
* **Speech-to-Text & Text-to-Speech**: Allows voice queries and voice readouts of AI responses.
* **Offline Resilience & PWA**: Locally caches last-fetched weather feeds. Shows cached indicators when network connection degrades instead of crashing.

---

## 🛠️ Technology Stack

* **Backend**: FastAPI (Python), SQLAlchemy (SQLite/PostgreSQL), Uvicorn, Pydantic-Settings, Google Generative AI (Gemini 1.5 Flash).
* **Frontend**: Next.js (React), Tailwind CSS v4, Lucide Icons, Leaflet Maps, HTML5 Web Speech APIs.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ and NPM v9+
* Python 3.10+

### 1. Backend Setup

Navigate to the `backend/` directory, set up your virtual environment, and install dependencies:

```bash
cd backend
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
DEMO_MODE=True
DATABASE_URL=sqlite:///./weathergpt.db
GEMINI_API_KEY=your_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```
*(Leave GEMINI_API_KEY empty to run on the local rule-based NLP fallback engine).*

Run the backend server:
```bash
python app/main.py
```
The backend API will run on `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the `frontend/` directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000` to view the application.

---

## 🛡️ Responsible AI & Source Transparency

* **Visual Separation**: Official alerts (labeled *🔴 ACTIVE WARNING*) are styled with distinct red borders, while AI recommendations are labeled as *AI recommended actions* to prevent confusion.
* **Explainable Scores**: Every risk score displays a direct table explaining how much each factor (visibility, wind speed, precipitation) contributed to the final score.
* **Disclaimers**: A prominent footer disclaimer reminds users to prioritize instructions from local emergency authorities during active storm events.
* **No Hallucination**: If weather data is unavailable, the chatbot prompts the user to input a valid city rather than inventing weather figures.

---

## 🗺️ Hackathon Demo Flow Scenario

1. **Dashboard Overview**: Open the dashboard for **Pune**, showing `27°C`, `Heavy Rain`, and a severe risk score of `82/100`. Expand the **"Why This Risk?"** card to see the breakdown (+35 Heavy Rain, +15 Precipitation Probability, +15 Ghat Topography landslide risk, +17 active alerts).
2. **AI Chatbot Grounding**: Ask "Will it rain tomorrow in Pune?". The bot checks forecast data, stating that rain probability is 85% with thunderstorms predicted.
3. **Route Intelligence**: Switch to the **Route Intel** tab. Set *From: Pune* and *To: Mumbai*. Click **Analyze Route**. Witness the timeline stops (Pune ➔ Lonavala [Severe Red] ➔ Khopoli [High Orange] ➔ Panvel [Moderate Yellow] ➔ Mumbai [Low Green]). Read the AI Travel Guidance recommending delay/earlier departure due to Western Ghats landslides.
4. **Interactive Map**: Switch to the **Live Map** tab. Toggle the layers, click on pins (like Pune or Mumbai) to see details, showing spatial weather intelligence.
5. **Command Center**: Toggle **Disaster Control** mode. Switch to the **Command Center** tab. View the aggregate metrics (17 Active Alerts, 6 High-Risk Areas) and read the AI Situation Summary of Western Ghats saturation.
6. **Agro-Meteorology**: Toggle **Farmer Mode** and ask "Should I irrigate my crops today?". The assistant analyzes the 92% rain forecast and recommends delaying irrigation to prevent waterlogging.
7. **Multilingual Toggle**: Click **मरा** (Marathi) or **हिं** (Hindi) in the header. Ask a question, and see the dashboard/AI respond in the chosen language.
8. **Offline Mode**: Check **Simulate Offline** in Settings. Observe the header transition to *Offline Mode* and watch the app fall back to local storage cache smoothly.
