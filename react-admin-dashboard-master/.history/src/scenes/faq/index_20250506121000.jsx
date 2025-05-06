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
          <Typography color={colors.greenAccent[500]} variant="h5">
            Descripción
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" color={colors.grey[100]}>
          El proyecto consiste en el desarrollo de un dashboard interactivo que gestiona y visualiza información proveniente de una base de datos de vuelos en Estados Unidos.
           Además, se integra con una API externa para mantener actualizado el registro de los vuelos.
           Esta herramienta tiene como objetivo facilitar la consulta, análisis y monitoreo de la información aeroportuaria en una sola interfaz intuitiva.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Objetivos Principales
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
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
          <Typography color={colors.greenAccent[500]} variant="h5">
          → Manejo de base de datos SQL
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"}>
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
          <Typography color={colors.greenAccent[500]} variant="h5">
          → Interacción y Visualización de Datos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"}>
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
          <Typography color={colors.greenAccent[500]} variant="h5">
            Referencias
          </Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography component="div">
            Hacer referencia a las fuentes de datos, como se obtuvieron, que se hizo con ellos, etc.
            Txeto largo, links.
            <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
              <li>Fuente de datos 1: Obtenida mediante API de Aerodatabox.</li>
              <li>Fuente de datos 2: Dataset público de vuelos (2023).</li>
              <li>Procesamiento: Limpieza con Python y Pandas.</li>
              <li>
                Dataset disponible en:
                <a
                  href="https://ejemplo.com/dataset"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', marginLeft: '5px' }}
                >
                  enlace al dataset
                </a>
              </li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
