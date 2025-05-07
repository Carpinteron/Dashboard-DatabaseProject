import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import PieChart2 from "../../components/PieChart2";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import RouteIcon from '@mui/icons-material/Route';
import LuggageIcon from '@mui/icons-material/Luggage';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';



const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //Para los ultimos vuelos
  const [recentFlights, setRecentFlights] = useState([]);
  // info general
  const [totalvuelos, setTotalVuelos] = useState(0);
  const [avgdistancia, setAvgDistancia] = useState(0);
  const [totalaeropuertos, setTotalAeropuertos] = useState(0);
  const [avgprecio, setAvgPrecio] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/api/lista-vuelos")
      .then((res) => res.json())
      .then((data) => setRecentFlights(data))
      .catch((error) => console.error("Error al obtener vuelos recientes:", error));
  }, []);

  //Para el total de vuelos
  useEffect(() => {
    const fetchTotalVuelos = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/infogeneral1`);
        const data = await res.json();
        if (data.success) {
          setTotalVuelos(data.data.totalvuelos);
        } else {
          console.error('Error en la respuesta:', data.message);
        }
      } catch (error) {
        console.error("Error al obtener el total de vuelos:", error);
      }
    };
    fetchTotalVuelos();
  }, []);


  //Para la distancia promedio
  useEffect(() => {
    const fetchAvgDistancia = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/infogeneral2`);
        const data = await res.json();
        if (data.success) {
          setAvgDistancia(data.data.avgdistancia);
        } else {
          console.error('Error en la respuesta:', data.message);
        }
      } catch (error) {
        console.error("Error al obtener la distancia promedio:", error);
      }
    };
    fetchAvgDistancia();
  }, []);

  // Para el total de aeropuertos
  useEffect(() => {
    const fetchTotalAeropuertos = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/infogeneral3`);
        const data = await res.json();

        if (data.success) {
          setTotalAeropuertos(data.data.totalaeropuertos);
        }
      } catch (error) {
        console.error("Error al obtener el total de aeropuertos:", error);
      }
    };
    fetchTotalAeropuertos();
  }, []);

  // Para el precio promedio
  useEffect(() => {
    const fetchAvgPrecio = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/infogeneral4`);
        const data = await res.json();

        if (data.success) {
          setAvgPrecio(data.data.avgprecio);
        }
      } catch (error) {
        console.error("Error al obtener el precio promedio:", error);
      }
    };
    fetchAvgPrecio();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Line Chart
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[300]}
              >
                Tendencia de Vuelos y Tarifas Promedio Anuales
              </Typography>
            </Box>

          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Vuelos Recientes
            </Typography>
          </Box>
          {recentFlights.map((flight, i) => (
            <Box
              key={`${flight.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  🛬 {flight.airport1} → {flight.airport2}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {flight.city1} → {flight.city2}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{new Date(flight.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</Box>

            </Box>

          ))}
        </Box>

        {/* ROW 2 - franja*/}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total de vuelos registrados"
            subtitle={totalvuelos || "Cargando..."}

            icon={
              <AirplaneTicketIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Promedio de distancia recorrida"
            subtitle={avgdistancia.toFixed(2) + " millas" || "Cargando..."}
            progress=""
            increase=""

            icon={
              <RouteIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Total de aeropuertos registrados"
            subtitle={totalaeropuertos || "Cargando..."}
            progress=""
            increase=""
            icon={
              <LuggageIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="Precio promedio de los vuelos"
            subtitle={"$" + avgprecio.toFixed(2) + " USD" || "Cargando..."}
            progress=""
            increase=""
            icon={
              <MonetizationOnIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>





        {/* ROW 3 */}

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Top 5 Rutas: Variación Anual de Pasajeros
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Número de Vuelos por Año 
          </Typography>
          <Box height="260px">
            <PieChart2 isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
           
          </Typography>
          <Box height="260px"">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>

  );
};

export default Dashboard;
