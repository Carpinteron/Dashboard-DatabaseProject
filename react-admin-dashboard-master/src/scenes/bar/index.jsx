import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

import InputBase from "@mui/material/InputBase";
import { useState } from "react";


const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para los años
  const [year1b, setYear1] = useState("");
  const [year2b, setYear2] = useState("");

 

  return (
    <Box m="20px">
      <Header
        title="Variación por año de la cantidad de pasajeros de las 5 rutas más concurridas"
        subtitle="Stacked Bar Chart"
      />
      <Box display="flex" justifyContent="center" gap={2} p={2}>
        {/* SEARCH BAR 1 */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Ingrese Año 1"
            value={year1b}
            onChange={(e) => setYear1(e.target.value)}
          />
        </Box>

        {/* SEARCH BAR 2 */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Ingrese Año 2"
            value={year2b}
            onChange={(e) => setYear2(e.target.value)}
          />
        </Box>
      
      </Box>

      <Box height="75vh">
        <BarChart year1b={year1b} year2b={year2b} /> {/* Puedes pasar los valores al gráfico si lo necesitas */}
      </Box>
    </Box>
  );
};

export default Bar;
