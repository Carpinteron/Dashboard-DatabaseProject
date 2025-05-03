import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Geography" subtitle="Simple Geography Chart" />

      <Box
  width="100%"   // Asegura que ocupe todo el ancho
  height="100%"  // Ajusta para ocupar toda la altura
  display="flex" // Usa flexbox para organizar mejor los elementos
  justifyContent="center" // Centra el contenido si es necesario
  alignItems="center"
  border={`1px solid ${colors.grey[100]}`}
  borderRadius="4px"
>

        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
