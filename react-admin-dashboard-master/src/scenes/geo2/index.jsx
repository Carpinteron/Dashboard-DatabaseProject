import { Box, useTheme } from "@mui/material";
import GeographyChart2 from "../../components/GeographyChart2";
import PieChart2 from "../../components/PieChart2";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";
import { InputBase } from "@mui/material";

const Geography2 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Estado para los años
  const hoy = new Date().toISOString().split('T')[0];
  const [npasag, setPasag] = useState("");
  const [fecha, setFecha] = useState(hoy);

  // Ejemplo: "2023-08-28"
  return (
    <Box m="20px">
      <Header title={`no se que`} subtitle={`Geography Chart | Fecha: ${fecha || hoy}`} />
      <Box display="inline-block" backgroundColor={colors.primary[400]} borderRadius="7px" p={0} mb={1}>
        <InputBase
          type="date" // Tipo nativo
          sx={{ ml: 2, flex: 1, color: "white" }}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: hoy }} // Limitar la fecha máxima a hoy
        />
      </Box>
      
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="10px">
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Ingrese Codigo IATA de Aeropuerto de Origen"
          value={npasag}
          onChange={(e) => setPasag(e.target.value)}
        />
      </Box>
      <Box
        display={"flex"}
        gap="6px"
        height={"75vh"}>
        <Box
          flex={7}
          //height="75vh"
          border={`1px solid ${colors.grey[100]}`}
          borderRadius="4px"
        >
          <GeographyChart2 year={fecha} npasag={npasag} />
        </Box>
        <Box
          flex={3}
          //height="75vh"
          border={`1px solid ${colors.grey[100]}`}
          borderRadius="4px">
          <PieChart2 />
        </Box>
      </Box>
    </Box>
  );
};

export default Geography2;
