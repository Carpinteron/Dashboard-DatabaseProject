import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const airplaneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const colores = ["#3399ff", "#ff5733", "#28a745", "#f39c12", "#8e44ad", "#00bcd4", "#e91e63"];

const FlightMap = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/rutas-mapa?year=2024&minPassengers=3000");
        const data = await res.json();
        setRoutes(data);
      } catch (err) {
        console.error("Error cargando rutas del mapa:", err);
      }
    };

    fetchRoutes();
  }, []);

  const airportData = {};
  routes.forEach(route => {
    if (!airportData[route.from]) {
      airportData[route.from] = {
        code: route.from,
        city: route.cityFrom,
        lat: parseFloat(route.lat1),
        lon: parseFloat(route.lon1),
        departures: [],
        arrivals: []
      };
    }
    if (!airportData[route.to]) {
      airportData[route.to] = {
        code: route.to,
        city: route.cityTo,
        lat: parseFloat(route.lat2),
        lon: parseFloat(route.lon2),
        departures: [],
        arrivals: []
      };
    }
    airportData[route.from].departures.push(route);
    airportData[route.to].arrivals.push(route);
  });

  return (
    <Box height="100%" width="100%">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1"
          attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
        />

        {Object.values(airportData).map((airport, index) => (
          <Marker key={index} position={[airport.lat, airport.lon]} icon={airplaneIcon}>
            <Popup>
              <strong>{airport.city}</strong><br />
              <hr />
              <div>
                <ul style={{ paddingLeft: "1em" }}>
                  {airport.departures.map((r, i) => (
                    <li key={i}>🛫 {r.from} 🠮 {r.to}</li>
                  ))}
                </ul>
                <ul style={{ paddingLeft: "1em" }}>
                  {airport.arrivals.map((r, i) => (
                    <li key={i}>🛬 {r.from} 🠮 {r.to}</li>
                  ))}
                </ul>
                <div><strong>Total salidas:</strong> 🛫 {airport.departures.length}</div>
                <div><strong>Total llegadas:</strong> 🛬 {airport.arrivals.length}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {routes.map((route, idx) => {
          const from = [parseFloat(route.lat1), parseFloat(route.lon1)];
          const to = [parseFloat(route.lat2), parseFloat(route.lon2)];
          return (
            <Polyline
              key={idx}
              positions={[from, to]}
              pathOptions={{
                color: colores[idx % colores.length],
                weight: 4,
                opacity: 0.8,
                dashArray: "5, 10",
              }}
            />
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default FlightMap;
