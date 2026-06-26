# D:\AegisGeoInt\communication\mesh_network.py
import logging
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class LinkType(Enum):
    PRIMARY_RF = "primary_rf"
    SECONDARY_LTE = "secondary_lte"
    TERTIARY_SATCOM = "tertiary_satcom"
    MESH = "mesh"
    STARLINK = "starlink"

@dataclass
class LinkQuality:
    type: LinkType
    strength: float
    latency_ms: float
    bandwidth_mbps: float
    is_active: bool
    range_km: float

class CommunicationManager:
    def __init__(self):
        self.rf_900 = LinkQuality(LinkType.PRIMARY_RF, 85, 50, 10, True, 100)
        self.lte_backup = LinkQuality(LinkType.SECONDARY_LTE, 60, 100, 20, False, 50)
        self.satcom = LinkQuality(LinkType.TERTIARY_SATCOM, 70, 600, 5, False, 1000)
        self.starlink = LinkQuality(LinkType.STARLINK, 75, 50, 200, False, 500)
        self.mesh_nodes = []
    
    def get_best_link(self) -> LinkQuality:
        active = [self.rf_900, self.lte_backup, self.satcom, self.starlink]
        active = [l for l in active if l.is_active]
        if active:
            return max(active, key=lambda l: l.strength)
        return self.rf_900
    
    def establish_mesh(self, drones: List) -> None:
        logger.info(f"🔗 Mesh network with {len(drones)} drones")
        self.mesh_nodes = [{"id": d.id, "status": "connected"} for d in drones]
