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

const Pie = () => {
  const [opcion, setOpcion] = useState("visitada");

  // Mapeo de títulos según la opción seleccionada
  const titulos = {
    visitada: "Top 5 Ciudades más visitadas",
    salidas: "Top 5 Ciudades con más vuelos de salida",
  };

  return (
    <Box m="20px">
      <Header title={titulos[opcion]} subtitle="Pie Chart" />

      <FormControl sx={{ minWidth: 250, mb: 2 }}>
        <InputLabel>Selecciona top</InputLabel>
        <Select
          value={opcion}
          label="Selecciona top"
          onChange={(e) => setOpcion(e.target.value)}
        >
          <MenuItem value="visitada">Top 5 Ciudades más visitadas</MenuItem>
          <MenuItem value="salidas">Top 5 Ciudades con más vuelos de salida</MenuItem>
        </Select>
      </FormControl>

      <Box height="75vh">
        <PieChart tipo={opcion} />
      </Box>
    </Box>
  );
};

export default Pie;
