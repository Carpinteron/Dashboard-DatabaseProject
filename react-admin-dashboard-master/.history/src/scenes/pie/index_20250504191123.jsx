import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";


const Pie = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Top 5 Ciudades más visitadas" subtitle="Pie Chart" />
      <Box display="flex" justifyContent="center" gap={2} p={2}>
              {/* SEARCH BAR 1 */}
              <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="2px">
                <InputBase
                  sx={{ ml: 2, flex: 1 }}
                  placeholder="Ingrese Año 1"
                  
                  //onChange={(e) => setYear1(e.target.value)}
                />
              </Box>
              </Box>
              <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
