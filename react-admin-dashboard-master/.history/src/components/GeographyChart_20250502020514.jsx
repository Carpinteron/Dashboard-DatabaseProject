/*import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { mockGeographyData as data } from "../data/mockData";

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <ResponsiveChoropleth
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 1000000]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor="#ffffff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
*/
// src/components/AirportMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Datos de aeropuertos
const airports = {
  JFK: { name: "JFK - New York", coords: [40.6413, -73.7781] },
  LAX: { name: "LAX - Los Angeles", coords: [33.9416, -118.4085] },
  ORD: { name: "ORD - Chicago", coords: [41.9742, -87.9073] },
  ATL: { name: "ATL - Atlanta", coords: [33.6407, -84.4277] },
};

// Ícono de avión más estilizado
const airplaneIcon = new L.Icon({
  iconUrl: "https://e7.pngegg.com/pngimages/361/470/png-clipart-airplane-aircraft-flight-airline-ticket-hotel-airplane-blue-angle.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const AirportMap = () => {
  const [from, setFrom] = useState("JFK");
  const [to, setTo] = useState("LAX");

  const fromCoords = airports[from].coords;
  const toCoords = airports[to].coords;

  return (
    <Box height="100%" width="100%">
      <Box display="flex" gap={2} p={2}>
        <FormControl>
          <InputLabel>Origen</InputLabel>
          <Select value={from} onChange={(e) => setFrom(e.target.value)} label="Origen">
            {Object.entries(airports).map(([code, info]) => (
              <MenuItem key={code} value={code}>{info.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Destino</InputLabel>
          <Select value={to} onChange={(e) => setTo(e.target.value)} label="Destino">
            {Object.entries(airports).map(([code, info]) => (
              <MenuItem key={code} value={code}>{info.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
      <TileLayer
  url={`https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ad4af2b3ce0543d7b1bc7e2dd416c6f1`}
  attribution='&copy; OpenStreetMap contributors, &copy; Thunderforest'
/>
        <Marker position={fromCoords} icon={airplaneIcon}>
          <Popup>Origen: {airports[from].name}</Popup>
        </Marker>
        <Marker position={toCoords} icon={airplaneIcon}>
          <Popup>Destino: {airports[to].name}</Popup>
        </Marker>
        <Polyline
          positions={[fromCoords, toCoords]}
          pathOptions={{
            color: "#3399ff",      // azul claro
            weight: 4,             // grosor de la línea
            opacity: 0.8,          // transparencia
            dashArray: "5, 10",    // opcional: línea discontinua
          }}
        />
      </MapContainer>
    </Box>
  );
};

export default AirportMap;



