import { Box, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useState } from "react";
import { tokens } from "../../theme";

const Line = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Estado para los años
  const [year1l, setYear1] = useState("");
  const [year2l, setYear2] = useState("");

  return (
    <Box m="20px">
      <Header title="Tendencia de Vuelos y Tarifas Promedio Anuales" subtitle="Line Chart" />
            <Box display="flex" justifyContent="center" gap={2} p={2}>
              {/* SEARCH BAR 1 */}
              <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
                <InputBase
                  sx={{ ml: 2, flex: 1 }}
                  placeholder="Ingrese Year 1"
                  value={year1l}
                  onChange={(e) => setYear1(e.target.value)}
                />
              </Box>
      
              {/* SEARCH BAR 2 */}
              <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
                <InputBase
                  sx={{ ml: 2, flex: 1 }}
                  placeholder="Ingrese Year 2"
                  value={year2l}
                  onChange={(e) => setYear2(e.target.value)}
                />
              </Box>
            </Box>
      
      <Box height="75vh">
        <LineChart  year1l={year1l} year2l={year2l} />
      </Box>
    </Box>
  );
};

export default Line;
