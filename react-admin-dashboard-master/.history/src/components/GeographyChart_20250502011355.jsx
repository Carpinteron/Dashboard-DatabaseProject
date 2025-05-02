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
import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from 'react-leaflet';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Aeropuertos ejemplo
const airports = {
  JFK: { name: 'JFK - New York', coords: [40.6413, -73.7781] },
  LAX: { name: 'LAX - Los Angeles', coords: [33.9416, -118.4085] },
  ORD: { name: 'ORD - Chicago', coords: [41.9742, -87.9073] },
  ATL: { name: 'ATL - Atlanta', coords: [33.6407, -84.4277] },
};

// Ícono de avión personalizado
const airplaneIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/681/681611.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const interpolate = (from, to, factor) => [
  from[0] + (to[0] - from[0]) * factor,
  from[1] + (to[1] - from[1]) * factor,
];

const AnimatedFlight = ({ from, to }) => {
  const [progress, setProgress] = useState(0);
  const [path, setPath] = useState([from]);
  const markerRef = useRef(null);

  // Centra el mapa en el vuelo
  const map = useMap();
  useEffect(() => {
    map.flyTo(from, 4);
  }, [from, map]);

  useEffect(() => {
    setProgress(0);
    setPath([from]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 0.01;
      if (currentProgress >= 1) {
        currentProgress = 1;
        clearInterval(interval);
      }

      const nextPoint = interpolate(from, to, currentProgress);
      setPath((prev) => [...prev, nextPoint]);

      // Mueve el avión
      if (markerRef.current) {
        markerRef.current.setLatLng(nextPoint);
      }

      setProgress(currentProgress);
    }, 30);

    return () => clearInterval(interval);
  }, [from, to]);

  return (
    <>
      <Polyline positions={path} color="blue" />
      <Marker position={from} icon={airplaneIcon}>
        <div>Origen</div>
      </Marker>
      <Marker
        icon={airplaneIcon}
        position={from}
        ref={markerRef}
        opacity={1}
      >
        <div>Avión</div>
      </Marker>
    </>
  );
};

const AirportMap = () => {
  const [from, setFrom] = useState('JFK');
  const [to, setTo] = useState('LAX');

  const fromCoords = airports[from].coords;
  const toCoords = airports[to].coords;

  return (
    <Box>
      <Box display="flex" gap={2} p={2}>
        <FormControl>
          <InputLabel>Origen</InputLabel>
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>
            {Object.entries(airports).map(([code, info]) => (
              <MenuItem key={code} value={code}>
                {info.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Destino</InputLabel>
          <Select value={to} onChange={(e) => setTo(e.target.value)}>
            {Object.entries(airports).map(([code, info]) => (
              <MenuItem key={code} value={code}>
                {info.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box height="75vh" width="100%">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {from !== to && <AnimatedFlight from={fromCoords} to={toCoords} />}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default AirportMap;
