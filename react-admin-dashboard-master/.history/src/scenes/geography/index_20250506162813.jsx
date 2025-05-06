import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";
import { InputBase } from "@mui/material";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Estado para los años
  const [npasag, setPasag] = useState("");
  const [year, setYear] = useState("");
  return (
    <Box m="20px">
      <Header title={`Vuelos de $ con más de ${npasag ||3000} pasajeros` }subtitle="Geography Chart" />
      
      <Box display="flex" justifyContent="center" gap={2} p={2}>
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Ingrese Año"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </Box>

      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Número de Pasajeros"
          value={npasag}
          onChange={(e) => setPasag(e.target.value)}
        />
      </Box>
     </Box>

      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <GeographyChart year={year} npasag={npasag}/>
      </Box>
    </Box>
  );
};

export default Geography;
