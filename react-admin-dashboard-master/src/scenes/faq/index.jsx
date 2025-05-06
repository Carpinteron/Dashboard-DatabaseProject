import { List, ListItem, ListItemText, Link, Box, useTheme } from "@mui/material";
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
    document.title = "Propósitos - Skylar";
  }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Propósitos - Skylar Dashboard" subtitle="Consideraciones del proyecto." />

      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4" fontWeight={"bold"}>
            Descripción
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h5" color={colors.grey[100]}>
          El proyecto consiste en el desarrollo de un dashboard interactivo que gestiona y visualiza información proveniente de una base de datos de vuelos en Estados Unidos.<br />
           Además, se integra con una API externa para mantener actualizado el registro de los vuelos.
           Esta herramienta tiene como objetivo facilitar la consulta, análisis<br /> y monitoreo de la información aeroportuaria en una sola interfaz intuitiva.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4"fontWeight={"bold"}>
            Objetivos Principales
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h5" color={colors.grey[100]}>
          • Implementar los conocimientos adquiridos en bases de datos SQL.<br />
          <br />
          • Conectar una base de datos real para visualizar datos dinámicos mediante un sitio web interactivo. <br />
          <br />
          • Integrar los datos a una API que permita actualizar automáticamente parte de la información.<br />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4" fontWeight={"bold"}>
          → Manejo de base de datos SQL
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"} variant="h5" color={colors.grey[100]}>
          • Mostrar datos actualizados directamente desde la base de datos.
          <br />
          • Diseñar consultas SQL optimizadas que generen datos relevantes para el usuario.
          <br />
          • Incluir información clave como el número de vuelos, aeropuertos o rutas más populares.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4" fontWeight={"bold"}>
          → Interacción y Visualización de Datos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"} variant="h5" color={colors.grey[100]}>
          • Permitir la comparación de tendencias entre diferentes aspectos como periodos o rutas.
          <br />
          • Organizar datos relevantes de la base de datos para que sea facil de buscar y entender.
          <br />
          • Usar herramientas visuales que permitan identificar datos rápidamente.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h4" fontWeight={"bold"}>
            Referencias
          </Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography component="div">
            Fuentes utilizadas para el desarrollo del proyecto
          </Typography>
          <Typography component="div" variant="h5" color={colors.grey[100]}>
            Hacer referencia a las fuentes de datos, como se obtuvieron, que se hizo con ellos, etc.
            Txeto largo, links.
            <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
            • OpenFlights Airport Dataset: https://openflights.org/data.php 
            <br />
            • OpenFlights Flights Dataset: https://github.com/jpatokal/openflights/blob/master/data/airports.dat
            <br />
            • USA Airport Dataset: https://www.kaggle.com/datasets/flashgordon/usa-airport-dataset
            <br />
            • USA Flights Dataset: https://www.kaggle.com/datasets/bhavikjikadara/us-airline-flight-routes-and-fares-1993-2024
            <br />
            • AeroDataBox API: https://rapidapi.com/aedbx-aedbx/api/aerodatabox/playground/apiendpoint_a52ca6b2-212c-49ea-952b-e8170cfb3b00
            <br />
            • Flights Data Database Script: <a href="/public/Flights_Data_Script.sql" download> Flights_Data_Script.sql </a>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
