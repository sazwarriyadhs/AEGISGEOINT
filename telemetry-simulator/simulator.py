#!/usr/bin/env python3
import json
import random
import time
import math
from datetime import datetime

class DroneSimulator:
    def __init__(self):
        self.drones = []
        self.init_drones()
        
    def init_drones(self):
        names = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL']
        routes = [
            [(-2.5, 140.5), (-2.7, 140.8), (-3.0, 141.0), (-3.2, 140.7), (-3.0, 140.3), (-2.7, 140.2)],
            [(-2.8, 139.8), (-3.0, 139.5), (-3.2, 139.7), (-3.0, 140.0)],
            [(-2.5, 141.0), (-2.3, 141.2), (-2.0, 141.5), (-2.2, 141.8)],
            [(-2.6, 140.0), (-2.8, 140.3), (-2.5, 140.5), (-2.3, 140.2)],
            [(-2.4, 140.7), (-2.6, 140.9), (-2.8, 140.6), (-2.6, 140.4)],
            [(-3.1, 139.6), (-3.3, 139.9), (-3.5, 139.7), (-3.3, 139.4)],
            [(-2.9, 140.8), (-3.1, 141.1), (-3.3, 140.9), (-3.1, 140.6)],
            [(-2.7, 139.5), (-2.9, 139.8), (-3.1, 139.6), (-2.9, 139.3)]
        ]
        
        missions = ['BORDER_PATROL', 'FOREST_PATROL', 'COASTAL_PATROL', 'SEARCH_RESCUE', 
                    'SURVEILLANCE', 'RECON', 'ESCORT', 'INTERDICTION']
        
        for i in range(8):
            self.drones.append({
                'id': f'DRN-{i+1:03d}',
                'name': f'DRONE {i+1:02d} - {names[i]}',
                'route': routes[i],
                'idx': 0,
                'progress': random.random(),
                'lat': routes[i][0][0],
                'lng': routes[i][0][1],
                'alt': random.randint(50, 250),
                'speed': random.randint(10, 35),
                'heading': random.randint(0, 360),
                'battery': random.randint(70, 100),
                'signal': random.randint(60, 100),
                'mission': missions[i],
                'status': 'ACTIVE'
            })
    
    def update(self):
        for drone in self.drones:
            route = drone['route']
            idx = drone['idx']
            progress = drone['progress'] + 0.02
            
            if progress >= 1.0:
                progress = 0
                idx = (idx + 1) % len(route)
            
            current = route[idx]
            next_idx = (idx + 1) % len(route)
            next_pt = route[next_idx]
            
            lat = current[0] + (next_pt[0] - current[0]) * progress
            lng = current[1] + (next_pt[1] - current[1]) * progress
            
            drone['lat'] = lat
            drone['lng'] = lng
            drone['idx'] = idx
            drone['progress'] = progress
            drone['battery'] -= random.random() * 0.3
            drone['alt'] += (random.random() - 0.5) * 3
            drone['heading'] = (drone['heading'] + (random.random() - 0.5) * 10) % 360
            
            if drone['battery'] < 15:
                drone['status'] = 'CRITICAL'
            elif drone['battery'] < 30:
                drone['status'] = 'WARNING'
            else:
                drone['status'] = 'ACTIVE'
    
    def run(self):
        print('=' * 60)
        print('🚁 AEGIS TELEMETRY SIMULATOR')
        print('=' * 60)
        print(f'🚁 Drones: {len(self.drones)}')
        print('🔄 Update setiap 2 detik')
        print('=' * 60)
        print('')
        print('Tekan Ctrl+C untuk berhenti')
        print('')
        
        try:
            while True:
                self.update()
                print(f"\n📍 {datetime.now().strftime('%H:%M:%S')} - Telemetry Update")
                print('-' * 60)
                
                for drone in self.drones:
                    status_color = '🟢' if drone['status'] == 'ACTIVE' else '🟡' if drone['status'] == 'WARNING' else '🔴'
                    print(f"  {status_color} {drone['name']} | Lat: {drone['lat']:.4f}, Lng: {drone['lng']:.4f} | Alt: {drone['alt']:.0f}m | Speed: {drone['speed']:.0f} km/h | Battery: {drone['battery']:.0f}% | {drone['mission']} | {drone['status']}")
                
                time.sleep(2)
        except KeyboardInterrupt:
            print('\n\n🛑 Simulator stopped!')

if __name__ == '__main__':
    sim = DroneSimulator()
    sim.run()
