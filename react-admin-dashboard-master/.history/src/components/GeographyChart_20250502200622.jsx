import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rutasMapa } from "../data/mockGeo";

// Ícono de avión estilizado
const airplaneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});
//Colores para las rutas
const colores = ["#3399ff", "#ff5733", "#28a745", "#f39c12", "#8e44ad", "#00bcd4", "#e91e63"];


const FlightMap = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes(rutasMapa);
  }, []);

  return (
    <Box height="100%" width="100%">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
        <TileLayer
          url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1`}
          attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
        />

        {routes.map((route, index) => {
          const from = [parseFloat(route.lat1), parseFloat(route.lon1)];
          const to = [parseFloat(route.lat2), parseFloat(route.lon2)];

          return (
            <div key={index}>
              {/* Línea estilo Thunderforest */}
              <Polyline positions={[from, to]} pathOptions={{
                color: colores[index % colores.length],  // rota los colores 
                weight: 4,             // grosor de la línea
                opacity: 0.8,          // transparencia
                dashArray: "5, 10",    // opcional: línea discontinua
              }} />
              {/* Íconos de avión en origen y destino */}
              <Marker position={from} icon={airplaneIcon} />
              <Marker position={to} icon={airplaneIcon} />
            </div>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default FlightMap;
