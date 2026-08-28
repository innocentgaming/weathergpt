import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import weather, chat, route, alerts, disaster, emergency, simulation, climate, location, report
from app.config.settings import settings

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WeatherGPT Backend API",
    description="Conversational Weather, Alerts and Disaster Copilot API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weather.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(route.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(disaster.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(climate.router, prefix="/api")
app.include_router(location.router, prefix="/api")
app.include_router(report.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "WeatherGPT API",
        "demo_mode": settings.DEMO_MODE,
        "database": settings.DATABASE_URL.split(":///")[0]  # returns sqlite or postgresql
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
