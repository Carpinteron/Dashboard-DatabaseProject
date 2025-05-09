import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";


const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Top 5 Ciudades más visitadas" subtitle="Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
