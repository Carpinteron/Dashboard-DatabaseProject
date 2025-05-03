import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { rutasMapa } from "../data/mockGeo";

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
    setRoutes(rutasMapa);
  }, []);

  // Agrupar rutas por aeropuerto
  const airports = routes.reduce((acc, route) => {
    // Agregar rutas por aeropuerto de origen y destino
    if (!acc[route.from]) acc[route.from] = [];
    if (!acc[route.to]) acc[route.to] = [];
    acc[route.from].push(route);
    acc[route.to].push(route);
    return acc;
  }, {});

  return (
    <Box height="100%" width="100%">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
        <TileLayer
          url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1`}
          attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
        />

        {Object.keys(airports).map((airportCode, index) => {
          // Obtener las rutas asociadas a este aeropuerto
          const airportRoutes = airports[airportCode];
          const airportRouteDetails = airportRoutes[0]; // Tomamos la primera ruta para obtener las coordenadas

          const airportPosition = [
            parseFloat(airportRouteDetails.lat1),
            parseFloat(airportRouteDetails.lon1),
          ];

          return (
            <div key={index}>
              {/* Marcador con nombre de la ciudad */}
              <Marker position={airportPosition} icon={airplaneIcon}>
                
              </Marker>

              {/* Rutas asociadas al aeropuerto */}
              {airportRoutes.map((route, routeIndex) => {
                const from = [parseFloat(route.lat1), parseFloat(route.lon1)];
                const to = [parseFloat(route.lat2), parseFloat(route.lon2)];

                return (
                  <div key={routeIndex}>
                    <Polyline
                      positions={[from, to]}
                      pathOptions={{
                        color: colores[routeIndex % colores.length],
                        weight: 4,
                        opacity: 0.8,
                        dashArray: "5, 10",
                      }}
                    />
                    {/* Íconos de avión en origen y destino */}
                    <Marker position={from} icon={airplaneIcon}>
                      <Popup>{route.cityFrom} ({route.from})</Popup>
                    </Marker>
                    <Marker position={to} icon={airplaneIcon}>
                      <Popup>{route.cityTo} ({route.to})</Popup>
                    </Marker>
                  </div>
                );
              })}
            </div>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default FlightMap;
