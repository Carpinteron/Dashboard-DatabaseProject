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
          const airportRoutes = airports[airportCode];

          // Buscar una ruta donde sea origen o destino
          const routeWithFrom = airportRoutes.find(route => route.from === airportCode);
          const routeWithTo = airportRoutes.find(route => route.to === airportCode);

          const cityName = routeWithFrom?.cityFrom || routeWithTo?.cityTo || "Ciudad desconocida";

          const lat = routeWithFrom
            ? parseFloat(routeWithFrom.lat1)
            : parseFloat(routeWithTo.lat2);
          const lon = routeWithFrom
            ? parseFloat(routeWithFrom.lon1)
            : parseFloat(routeWithTo.lon2);

          const airportPosition = [lat, lon];

          return (
            <div key={index}>
              {/* Marcador del aeropuerto con Popup personalizado */}
              <Marker position={airportPosition} icon={airplaneIcon}>
                <Popup>
                  <div>
                    <strong>{cityName}</strong><br />
                    <em>{airportCode}</em>
                    <hr />
                    <ul style={{ paddingLeft: "1em", marginTop: "0.5em" }}>
                      {airportRoutes.map((route, idx) => {
                        const isOrigin = route.from === airportCode;
                        return (
                          <li key={idx} style={{ fontSize: "0.9em" }}>
                            {isOrigin
                              ? `${route.from} 🠮 ${route.to}`
                              : `${route.to} 🠮 ${route.from}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Popup>
              </Marker>

              {/* Rutas asociadas a este aeropuerto */}
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
