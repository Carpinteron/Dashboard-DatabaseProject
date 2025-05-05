import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";


const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Top 5 Ciudades más visitadas" subtitle="Pie Chart" />
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
              <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
