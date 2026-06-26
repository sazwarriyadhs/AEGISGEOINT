# D:\AegisGeoInt\papua-operations\mission_router.py
import logging
from enum import Enum
from dataclasses import dataclass

logger = logging.getLogger(__name__)

class OperationType(Enum):
    BORDER_PATROL = "border_patrol"
    FOREST_PATROL = "forest_patrol"
    SEARCH_RESCUE = "search_rescue"
    AREA_SURVEILLANCE = "area_surveillance"
    MARITIME_PATROL = "maritime_patrol"

@dataclass
class OperationConfig:
    operation_type: OperationType
    priority: str
    duration_hours: float
    area_km2: float
    terrain: str

class MissionRouter:
    def __init__(self):
        self.tier1_count = 4
        self.tier2_count = 2
        self.tier3_count = 1
    
    def assign_mission(self, operation: OperationConfig) -> dict:
        logger.info(f"📋 Assigning: {operation.operation_type.value}")
        
        if operation.operation_type == OperationType.BORDER_PATROL:
            if operation.area_km2 > 1000:
                return self._tier3(operation)
            return self._tier2(operation)
        
        elif operation.operation_type == OperationType.FOREST_PATROL:
            if operation.duration_hours > 4:
                return self._tier2(operation)
            return self._tier1(operation)
        
        elif operation.operation_type == OperationType.SEARCH_RESCUE:
            return self._tier2(operation)
        
        elif operation.operation_type == OperationType.AREA_SURVEILLANCE:
            if operation.area_km2 > 5000:
                return self._tier3(operation)
            elif operation.area_km2 > 1000:
                return self._tier2(operation)
            return self._tier1(operation)
        
        elif operation.operation_type == OperationType.MARITIME_PATROL:
            return self._tier3(operation)
        
        return self._tier2(operation)
    
    def _tier1(self, op):
        return {"tier": 1, "type": "Tactical Drone", "count": 2, "reason": "Small area / short duration"}
    
    def _tier2(self, op):
        return {"tier": 2, "type": "VTOL ISR", "count": 1, "reason": "Medium area / multi-role"}
    
    def _tier3(self, op):
        return {"tier": 3, "type": "Strategic Long-Endurance", "count": 1, "reason": "Large area / long duration"}
