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

  const [tempYear1, setTempYear1] = useState("");
  const [year1b, setYear1] = useState("");
  
  const [tempYear2, setTempYear2] = useState("");
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
           value={tempYear1}
           onChange={(e) => {
             const value = e.target.value;
             if (/^\d{0,4}$/.test(value)) {
               setTempYear1(value);
               if (value.length === 4) {
                 setYear1(value); // solo se guarda el valor si son 4 dígitos
               }
             }
           }}
          />
        </Box>

        {/* SEARCH BAR 2 */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Ingrese Año 2"
            value={tempYear2}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,4}$/.test(value)) {
                setTempYear2(value);
                if (value.length === 4) {
                  setYear2(value);
                }
              }
            }}
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
