import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const Pie = () => {
  const [opcion, setOpcion] = useState("ciudades");

  return (
    <Box m="20px">
      <Header title="Top 5 Ciudades más visitadas" subtitle="Pie Chart" />

      {/* Selector de opciones */}
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Selecciona top</InputLabel>
        <Select
          value={opcion}
          label="Selecciona datos"
          onChange={(e) => setOpcion(e.target.value)}
        >
          <MenuItem value="ciudades">Top 5 Ciudades mas </MenuItem>
          <MenuItem value="aerolineas">Top 5 Aerolíneas</MenuItem>
        </Select>
      </FormControl>

      {/* Gráfica */}
      <Box height="75vh">
        <PieChart tipo={opcion} />
      </Box>
    </Box>
  );
};

export default Pie;
