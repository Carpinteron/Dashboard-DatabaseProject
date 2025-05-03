
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
  // Filtrar las rutas solo por año (2021)
  const filterRoutes = (routes) => {
    return routes.filter(route => route.year === 2021);
  };

  // Rutas filtradas
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  // Actualizar las rutas filtradas cada vez que cambian los filtros
  useEffect(() => {
    setFilteredRoutes(filterRoutes(rutasMapa));
  }, []);

  return (
    <Box height="100%" width="100%">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
        <TileLayer
          url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1`}
          attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
        />

        {/* Mostrar las rutas filtradas */}
        {filteredRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={[
              [route.lat1, route.lon1],  // Coordenadas del aeropuerto de origen
              [route.lat2, route.lon2]   // Coordenadas del aeropuerto de destino
            ]}
            pathOptions={{
              color: "#ff5733",    // Color de las rutas
              weight: 4,           // Grosor de la línea
              opacity: 0.8,        // Transparencia
            }}
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default FlightMap;