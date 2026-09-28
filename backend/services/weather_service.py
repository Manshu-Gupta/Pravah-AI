"""
Weather & Cyclone Forecasting Service for TOOFAN AI
Simulates high-resolution atmospheric variables for Cyclone Varsha & Cyclone Varun.
"""
from typing import Dict, Any

class WeatherService:
    def __init__(self):
        self.source = "IMD / ECMWF Ensemble (Simulated)"
    
    def get_current_cyclone(self) -> Dict[str, Any]:
        return {
            "name": "Simulated Cyclone Varsha",
            "scenario": "SIMULATED SCENARIO",
            "status": "PRE-LANDFALL",
            "category": "Severe Cyclonic Storm (SCS)",
            "sustained_wind_speed": 120,
            "gust_speed": 145,
            "central_pressure_hpa": 974,
            "time_to_landfall_hours": 18,
            "expected_surge_m": 2.6,
            "expected_24h_rainfall_mm": 210,
            "current_location": {"lat": 17.15, "lng": 83.25},
            "bearing": "NW at 14 km/h",
            "coastal_impact_zone": "East Godavari / Andhra Coastal Corridor & Bay of Bengal",
            "confidence_cone_radius_km": 45
        }

    def get_track_waypoints(self) -> list:
        return [
            {"time": "T-18h (Current)", "lat": 17.15, "lng": 83.25, "type": "CURRENT", "wind": "120 km/h", "surge": "2.6m"},
            {"time": "T-12h (Forecast)", "lat": 17.55, "lng": 83.05, "type": "FORECAST", "wind": "125 km/h", "surge": "2.8m"},
            {"time": "T-6h (Forecast)", "lat": 17.95, "lng": 82.80, "type": "FORECAST", "wind": "130 km/h", "surge": "3.1m"},
            {"time": "T-0h (Landfall)", "lat": 18.25, "lng": 82.60, "type": "LANDFALL", "wind": "120 km/h", "surge": "2.9m"},
            {"time": "T+6h (Inland Decay)", "lat": 18.55, "lng": 82.35, "type": "INLAND", "wind": "75 km/h", "surge": "0.8m"}
        ]

weather_service = WeatherService()
