// src/components/FlightMap.jsx
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rutasMapa } from "../data/mockGeo"; // Datos desde mockData.js

// Ícono de avión estilizado
const airplaneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const FlightMap = () => {
  // Rutas (sin filtrar por año)
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  useEffect(() => {
    setFilteredRoutes(rutasMapa);
  }, []);

  return (
    <Box height="100%" width="100%">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
        <TileLayer
          url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1`}
          attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
        />

        {/* Mostrar todas las rutas disponibles */}
        {filteredRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={[
              [parseFloat(route.lat1), parseFloat(route.lon1)],
              [parseFloat(route.lat2), parseFloat(route.lon2)]
            ]}
            pathOptions={{
              color: "#ff5733",
              weight: 4,
              opacity: 0.8,
            }}
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default FlightMap;
