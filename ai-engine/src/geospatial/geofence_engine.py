# src/geospatial/geofence_engine.py
import logging
logger = logging.getLogger(__name__)

class GeofenceEngine:
    def __init__(self, geofence_file=None):
        self.geofence_file = geofence_file
        self.geofences = []
        logger.info(f"✅ GeofenceEngine initialized")
    
    def check_point(self, point, geofence_id=None):
        return {"inside": False, "geofence": None}
    
    def list_geofences(self):
        return self.geofences
