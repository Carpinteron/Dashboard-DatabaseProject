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
// src/components/MapChart.jsx
import React, { useState } from 'react';
import { Box, Grid, MenuItem, Select, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Datos de ejemplo (puedes ampliarlo luego)
const cityData = {
  California: {
    "Los Ángeles": [34.0522, -118.2437],
    "San Francisco": [37.7749, -122.4194],
    "San Diego": [32.7157, -117.1611]
  },
  Texas: {
    Houston: [29.7604, -95.3698],
    Austin: [30.2672, -97.7431],
    Dallas: [32.7767, -96.7970]
  },
};

const MapChart = () => {
  const [state, setState] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const cities = state ? Object.keys(cityData[state]) : [];

  const originCoords = state && origin ? cityData[state][origin] : null;
  const destCoords = state && destination ? cityData[state][destination] : null;

  const polylinePositions = originCoords && destCoords ? [originCoords, destCoords] : [];

  return (
    <Box>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">Estado:</Typography>
          <Select
            fullWidth
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setOrigin('');
              setDestination('');
            }}
          >
            {Object.keys(cityData).map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">Origen:</Typography>
          <Select
            fullWidth
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            disabled={!state}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">Destino:</Typography>
          <Select
            fullWidth
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!state}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Box height="600px" width="100%">
        <MapContainer center={[37.0902, -95.7129]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {originCoords && (
            <Marker position={originCoords}>
              <Popup>Origen: {origin}</Popup>
            </Marker>
          )}

          {destCoords && (
            <Marker position={destCoords}>
              <Popup>Destino: {destination}</Popup>
            </Marker>
          )}

          {polylinePositions.length === 2 && (
            <Polyline positions={polylinePositions} color="blue" />
          )}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapChart;

