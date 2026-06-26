# src/intelligence/anomaly_detection.py
import logging
logger = logging.getLogger(__name__)

class AnomalyDetector:
    def __init__(self, threshold=0.8):
        self.threshold = threshold
        logger.info(f"✅ AnomalyDetector initialized")
    
    def detect(self, data):
        return {"is_anomaly": False, "score": 0.0}
    
    def get_patterns(self, time_range="24h"):
        return []
