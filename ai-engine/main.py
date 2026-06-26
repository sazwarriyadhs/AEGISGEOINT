import sys
import os
import logging
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
sys.path.insert(0, str(Path(__file__).parent / "src"))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Config:
    def __init__(self):
        self.config = {
            "api": {"host": "0.0.0.0", "port": 8000, "ws_port": 5002}
        }
    
    def get(self, key, default=None):
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

if __name__ == "__main__":
    config = Config()
    logger.info("=" * 60)
    logger.info("🛰️  AEGISGEOINT AI ENGINE")
    logger.info("=" * 60)
    logger.info("✅ AI Engine started!")
    logger.info(f"📡 API: http://{config.get('api.host')}:{config.get('api.port')}")
    logger.info("=" * 60)
    logger.info("🚀 AI Engine is running...")
    
    while True:
        time.sleep(60)
        logger.info("💓 Heartbeat - AI Engine is alive")
