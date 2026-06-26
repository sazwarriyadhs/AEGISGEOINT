# src/detection/weapon_detector.py
import logging
logger = logging.getLogger(__name__)

class WeaponDetector:
    def __init__(self, model_path=None):
        self.model_path = model_path
        logger.info(f"✅ WeaponDetector initialized")
    
    def detect(self, image):
        return []
