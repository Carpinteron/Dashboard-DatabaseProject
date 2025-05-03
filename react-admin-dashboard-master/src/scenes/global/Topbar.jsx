import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme.js";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";





const styledBox = styled(Box);





const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

 

  return (
    <Box display="flex" justifyContent="center" gap={2} p={2}>
      {/* SEARCH BAR */}
      <Box 
      display="flex"
      backgroundColor={colors.primary[400]}
      borderRadius="3px">
        <InputBase 
        sx={{ml:2,flex:1 }}
         borderRadius="3px"
         placeholder="Search"/>
         
      </Box>
      <Box 
      display="flex"
      backgroundColor={colors.primary[400]}
      borderRadius="3px">
        <InputBase 
        sx={{ml:2,flex:1 }}
         borderRadius="3px"
         placeholder="Search"/>
      </Box>


      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <RefreshOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;

