import json

city_regions = {
    "Riyadh": {"lat": 24.7136, "lng": 46.6753},
    "Jeddah": {"lat": 21.4858, "lng": 39.1925},
    "Mecca": {"lat": 21.3891, "lng": 39.8579},
    "Medina": {"lat": 24.5247, "lng": 39.5692},
    "Dammam": {"lat": 26.4207, "lng": 50.0888},
    "Al Khobar": {"lat": 26.2172, "lng": 50.1971},
    "Abha": {"lat": 18.2465, "lng": 42.5117},
    "Taif": {"lat": 21.4373, "lng": 40.5127},
    "AlUla": {"lat": 26.6073, "lng": 37.9234},
    "Jazan": {"lat": 16.8890, "lng": 42.5706},
    "Tabuk": {"lat": 28.3838, "lng": 36.5550},
    "Diriyah": {"lat": 24.7370, "lng": 46.5758},
}

def create_polygon(lat, lng, offset=0.5):
    return [
        [lng - offset, lat - offset],
        [lng - offset, lat + offset],
        [lng + offset, lat + offset],
        [lng + offset, lat - offset],
        [lng - offset, lat - offset]
    ]

features = []

for city, coords in city_regions.items():
    polygon = create_polygon(coords["lat"], coords["lng"])
    features.append({
        "type": "Feature",
        "properties": {
            "name": city
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [polygon]
        }
    })

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open("saudi-cities-polygons.geojson", "w") as f:
    json.dump(geojson, f)

print("✅ GeoJSON saved to saudi-cities-polygons.geojson")
