import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';


const Pie = () => {
  return (
    <Box m="20px">
      <Header title="5 ciudades más visitadas" subtitle="Pie Chart" />
      <IconButton>
          <RefreshOutlinedIcon />
        </IconButton>
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
