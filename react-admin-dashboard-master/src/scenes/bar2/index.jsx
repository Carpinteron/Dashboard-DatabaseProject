import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart2 from "../../components/BarChart2";

const Bar2 = () => {
  return (
    <Box m="20px">
      <Header title="Cantidad de vuelos por cada rango de distancia recorrida" subtitle="Bar Chart" />
      <Box height="75vh">
        <BarChart2 />
      </Box>
    </Box>
  );
};

export default Bar2;