import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { tokens } from "../../theme";
import {  Button, IconButton, Typography, useTheme } from "@mui/material";
import styled from "@emotion/styled";
import InputBase from "@mui/material/InputBase";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

const Bar = () => {
   const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const year1=0
    const year2=0
  return (
    <Box m="20px">
      <Header title="Variación por año de la cantidad de pasajeros de las 5 rutas más concurridas" subtitle="Stacked Bar Chart" />
      <Box display="flex" justifyContent="center" gap={2} p={2}>
           {/* SEARCH BAR */}
           <Box 
           display="flex"
           backgroundColor={colors.primary[400]}
           borderRadius="2px">
             <InputBase 
             sx={{ml:2,flex:1 }}
              borderRadius="2px"
              placeholder="Search"/>
              
           </Box>
           <Box 
           display="flex"
           backgroundColor={colors.primary[400]}
           borderRadius="2px">
             <InputBase 
             sx={{ml:2,flex:1 }}
              borderRadius="2px"
              placeholder="Search"/>
           </Box>
           <IconButton>
               <DoneOutlineIcon onClick={year1=InputBase}/>
            </IconButton>
       </Box>
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
