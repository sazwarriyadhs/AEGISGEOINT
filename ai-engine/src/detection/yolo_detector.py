# src/detection/yolo_detector.py
import cv2
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class YOLODetector:
    def __init__(self, model_path=None, confidence_threshold=0.5):
        self.model_path = model_path or "models/pretrained/yolov8x.pt"
        self.confidence_threshold = confidence_threshold
        self.model = None
        self.classes = []
        logger.info(f"✅ YOLODetector initialized")
    
    def detect(self, image, confidence_threshold=None, classes=None):
        return []
    
    def detect_from_file(self, image_path, **kwargs):
        return []
