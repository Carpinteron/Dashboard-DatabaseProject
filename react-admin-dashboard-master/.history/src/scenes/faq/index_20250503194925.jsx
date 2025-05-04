import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useEffect } from "react";

const FAQ = () => {
  useEffect(() => {
      document.title = "Proposito - Skylar";
    }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Proposito" subtitle="aaaaa" />

      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
           blaaaaaaaaaa
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            bla bla bla bla
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
           bleeeeeeeee
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ble ble ble ble
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            bliiiiiiiiiii
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            bli bli bli bli
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            blooooooooooo
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            blo blo blo blo 
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
           bluuuuuuuuuuu
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            blu blu blu blu
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
