# D:\AegisGeoInt\ai-engine\src\config\config.py
import os
import json
from pathlib import Path

class Config:
    def __init__(self):
        self.config = self.load_config()
    
    def load_config(self):
        # Database config
        return {
            "api": {
                "host": os.getenv("API_HOST", "0.0.0.0"),
                "port": int(os.getenv("API_PORT", 8000)),
                "ws_port": int(os.getenv("WS_PORT", 5002))
            },
            "database": {
                "host": os.getenv("DB_HOST", "postgres"),
                "port": int(os.getenv("DB_PORT", 5432)),
                "name": os.getenv("DB_NAME", "aegis_db"),
                "user": os.getenv("DB_USER", "aegis_user"),
                "password": os.getenv("DB_PASSWORD", "aegis_password")
            },
            "models": {
                "yolo_path": os.getenv("YOLO_PATH", "models/pretrained/yolov8x.pt"),
                "weapon_path": os.getenv("WEAPON_PATH", "models/pretrained/weapon_detector.pt"),
                "threat_classifier_path": os.getenv("THREAT_CLASSIFIER_PATH", "models/trained/threat_classifier.pkl"),
                "anomaly_detector_path": os.getenv("ANOMALY_DETECTOR_PATH", "models/trained/anomaly_detector.pkl")
            },
            "detection": {
                "confidence_threshold": float(os.getenv("CONFIDENCE_THRESHOLD", 0.5)),
                "iou_threshold": float(os.getenv("IOU_THRESHOLD", 0.45)),
                "max_detections": int(os.getenv("MAX_DETECTIONS", 100))
            },
            "geospatial": {
                "geofence_file": os.getenv("GEOFENCE_FILE", "data/geofences.json"),
                "default_zoom": int(os.getenv("DEFAULT_ZOOM", 12))
            },
            "threat": {
                "levels": ["low", "medium", "high", "critical"],
                "escalation_threshold": float(os.getenv("ESCALATION_THRESHOLD", 0.7))
            },
            "tracking": {
                "max_age": int(os.getenv("TRACKING_MAX_AGE", 30)),
                "n_init": int(os.getenv("TRACKING_N_INIT", 3))
            },
            "sensor_fusion": {
                "enable_gps": os.getenv("ENABLE_GPS", "true").lower() == "true",
                "enable_imu": os.getenv("ENABLE_IMU", "true").lower() == "true",
                "enable_visual": os.getenv("ENABLE_VISUAL", "true").lower() == "true",
                "enable_lidar": os.getenv("ENABLE_LIDAR", "false").lower() == "true"
            },
            "logging": {
                "level": os.getenv("LOG_LEVEL", "INFO"),
                "file": os.getenv("LOG_FILE", "logs/ai_engine.log"),
                "format": os.getenv("LOG_FORMAT", "json")
            }
        }
    
    def get(self, key, default=None):
        """Get configuration value by dot notation"""
        keys = key.split('.')
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
                if value is None:
                    return default
            else:
                return default
        return value if value is not None else default
    
    def set(self, key, value):
        """Set configuration value by dot notation"""
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value
    
    def reload(self):
        """Reload configuration from environment"""
        self.config = self.load_config()
        return self.config
    
    def to_json(self):
        """Convert config to JSON"""
        return json.dumps(self.config, indent=2)

# Singleton instance
_config_instance = None

def get_config():
    global _config_instance
    if _config_instance is None:
        _config_instance = Config()
    return _config_instance
