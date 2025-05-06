import { Box, useTheme } from "@mui/material";
import GeographyChart2 from "../../components/GeographyChart2";
import PieChart2 from "../../components/PieChart2";
import Header from "../../components/Header";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from "@mui/material/IconButton";
import { tokens } from "../../theme";
import { useState } from "react";
import { InputBase } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const Geography2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estados para el código IATA y la fecha
  const hoy = new Date().toISOString().split('T')[0];
  const [orig, setOrig] = useState(""); // Código IATA
  const [fecha, setFecha] = useState(hoy); // Fecha
  const [routes, setRoutes] = useState([]); // Rutas obtenidas del backend
  // Agregar un estado para forzar la recarga del PieChart
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Función para obtener rutas
  const fetchRoutes = async (forceUpdate = false) => {
    try {
      const res = await fetch(`http://localhost:3001/api/rutas-mapa2?fecha=${fecha}&airportOriginIataCode=${orig}&forceUpdate=${forceUpdate}`);
      const data = await res.json();
      setRoutes(data); // Actualiza las rutas en el estado
    } catch (err) {
      console.error("Error al cargar rutas:", err);
    }
  };

  return (
    <Box m="20px">
      <Header title={`Destinos desde el aeropuerto ${orig || "LAX"}`} subtitle={`Geography Chart | Fecha: ${fecha || hoy}`} />
      <Box display="flex" justifyContent="center" gap={2} p={2}>
        {/* Input para la fecha */}
        <Box display="inline-block" backgroundColor={colors.primary[400]} borderRadius="7px" p={0} mb={1}>
          <InputBase
            type="date"
            sx={{ ml: 2, flex: 1, color: "white" }}
            value={fecha || hoy}
            onChange={(e) => setFecha(e.target.value)} // Actualiza el estado de la fecha
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: hoy }} // Limitar la fecha máxima a hoy
          />
        </Box>

        {/* Input para el código IATA */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="10px">
          <InputBase
            sx={{ ml: 2, flex: 2 }}
            placeholder="Ingrese Código IATA de Aeropuerto de Origen"
            value={orig}
            onChange={(e) => setOrig(e.target.value)} // Actualiza el estado del código IATA
          />
        </Box>
          {/* Botón para activar FetchRoutes */}
          <Box display="flex" gap={1}>
            <Tooltip title="Actualizar rutas desde el backend">
              <IconButton onClick={() => fetchRoutes(true)}> {/* Llama a fetchRoutes con forceUpdate=true */}
                <CheckCircleOutlineIcon /> {/* Ícono de un chulito */}
              </IconButton>
            </Tooltip>
        
          {/* Botón de Refresh */}
          <Box display="flex">
            <Tooltip title="Recargar el gráfico de pastel">
            <IconButton onClick={() => setRefreshCounter(prev => prev + 1)}>
            <RefreshOutlinedIcon />
          </IconButton>
            </Tooltip>
          
       
    

      {/* Contenedor para los gráficos */}
      <Box display={"flex"} gap="6px" height={"75vh"}>
        
        <Box
          flex={3}
          borderRadius="4px">
          <PieChart2 refreshCounter={refreshCounter} />
        </Box>
        </Box>
      </Box>
    </Box>
    
  );
};

export default Geography2;