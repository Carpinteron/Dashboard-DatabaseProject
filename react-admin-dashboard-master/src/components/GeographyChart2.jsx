import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTheme } from "@mui/material";
import L from 'leaflet';

const airplaneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// 🎨 Tus colores personalizados
const colores = ["#3399ff", "#ff5733", "#28a745", "#f39c12", "#8e44ad", "#00bcd4", "#e91e63"];

const GeographyChart2 = ({ fecha, iataCode, forceUpdate, shouldFetch, setShouldFetch }) => {
  const [routes, setRoutes] = useState([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // 🎨 Estilo para popups según el modo
  useEffect(() => {
    const styleId = 'leaflet-popup-custom';
    let styleTag = document.getElementById(styleId);

    const popupBg = isDark ? "#141b2d" : "#ffffff";
    const popupText = isDark ? "#f0f0f0" : "#111111";
    const popupTip = isDark ? "#1c1c1c" : "#eeeeee";

    const css = `
      .leaflet-container .leaflet-popup-content-wrapper {
        background-color: ${popupBg} !important;
        color: ${popupText} !important;
        border-radius: 8px !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
      }
      .leaflet-container .leaflet-popup-tip {
        background-color: ${popupTip} !important;
      }
    `;

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = css;
  }, [isDark]);

  // Realizar la búsqueda solo cuando `shouldFetch` sea true
  useEffect(() => {
    if (shouldFetch) {
      const fetchRoutes = async () => {
        try {
          // Validar parámetros antes de realizar la solicitud
          if (!fecha || !iataCode) {
            console.warn("Parámetros inválidos: fecha o iataCode están vacíos.");
            setShouldFetch(false);
            return;
          }

          const res = await fetch(`http://localhost:3001/api/rutas-mapa2?fecha=${fecha}&airportOriginIataCode=${iataCode}&forceUpdate=${forceUpdate}`);

          // Verificar si la respuesta es exitosa
          if (!res.ok) {
            throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();
          console.log("Rutas recibidas:", data);

          // Validar si los datos están vacíos
          if (!data || data.length === 0) {
            console.warn("No hay rutas para mostrar.");
          }

          setRoutes(data); // Actualiza las rutas en el estado
        } catch (err) {
          console.error("Error cargando rutas del mapa:", err.message);
        } finally {
          setShouldFetch(false); // Resetea el estado para evitar búsquedas repetidas
        }
      };

      fetchRoutes();
    }
  }, [shouldFetch, fecha, iataCode, forceUpdate, setShouldFetch]);

  // Procesar los datos de las rutas para el mapa
  const airportData = {};
  if (routes && routes.length > 0) {
    routes.forEach(route => {
      if (!airportData[route.airport1]) {
        airportData[route.airport1] = {
          code: route.airport1,
          city: route.city1,
          lat: parseFloat(route.latitude_airport1),
          lon: parseFloat(route.longitude_airport1),
          departures: [],
          arrivals: []
        };
      }
      if (!airportData[route.airport2]) {
        airportData[route.airport2] = {
          code: route.airport2,
          city: route.city2,
          lat: parseFloat(route.latitude_airport2),
          lon: parseFloat(route.longitude_airport2),
          departures: [],
          arrivals: []
        };
      }
      airportData[route.airport1].departures.push(route);
      airportData[route.airport2].arrivals.push(route);
    });
  }

  if (!routes || routes.length === 0) {
    return (
      <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
        <p>No hay rutas disponibles para los parámetros seleccionados.</p>
      </Box>
    );
  }

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
                    <li key={i}>🛫 {r.city1} → {r.city2}</li>
                  ))}
                </ul>
                <ul style={{ paddingLeft: "1em" }}>
                  {airport.arrivals.map((r, i) => (
                    <li key={i}>🛬 {r.city1} → {r.city2}</li>
                  ))}
                </ul>
                <div><strong>Total salidas:</strong> {airport.departures.length}</div>
                <div><strong>Total llegadas:</strong> {airport.arrivals.length}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {routes.map((route, idx) => {
          const from = [parseFloat(route.lat1), parseFloat(route.lon1)];
          const to = [parseFloat(route.lat2), parseFloat(route.lon2)];

          if (isNaN(from[0]) || isNaN(from[1]) || isNaN(to[0]) || isNaN(to[1])) {
            console.warn("Coordenadas inválidas para la ruta:", route);
            return null;
          }

          return (
            <Polyline
              key={idx}
              positions={[from, to]}
              pathOptions={{
                color: colores[idx % colores.length],
                weight: 4,
                opacity: isDark ? 0.7 : 0.9,
                dashArray: "6, 10"
              }}
            />
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default GeographyChart2;