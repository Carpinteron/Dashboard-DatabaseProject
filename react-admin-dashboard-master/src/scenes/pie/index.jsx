import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";


const Pie = () => {
  const [opcion, setOpcion] = useState("visitada");
  const theme = useTheme();
   const colors = tokens(theme.palette.mode);


  // Mapeo de títulos según la opción seleccionada
  const titulos = {
    visitada: "Top 5 Ciudades más visitadas",
    salidas: "Top 5 Ciudades con más vuelos de salida",
  };

  return (
    <Box m="20px">
      <Header title={titulos[opcion]} subtitle="Pie Chart" />
      
      <FormControl sx={{ minWidth: 210, mb: 2 }}>
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="1px">
        <InputLabel>Selecciona top</InputLabel>
        <Select
          value={opcion}
          label="Selecciona top"
          onChange={(e) => setOpcion(e.target.value)}
        >
          <MenuItem value="visitada">Top 5 Ciudades más visitadas</MenuItem>
          <MenuItem value="salidas">Top 5 Ciudades con más vuelos de salida</MenuItem>
        </Select>
        </Box>
      </FormControl>
      
      <Box height="75vh">
        <PieChart tipo={opcion} />
      </Box>
    </Box>
  );
};

export default Pie;
