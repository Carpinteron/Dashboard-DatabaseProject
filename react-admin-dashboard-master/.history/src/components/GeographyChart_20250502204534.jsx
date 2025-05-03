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

  // Obtener la lista de aeropuertos únicos y su posición
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
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80%", width: "100%" }}>
        <TileLayer
          u
