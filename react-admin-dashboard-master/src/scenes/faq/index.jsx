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
    document.title = "Proposito - Skylar";
  }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Propósito - Skylar Dashboard" subtitle="Consideraciones del proyecto." />

      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Descripción y Consideraciones
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          El proyecto consiste en el desarrollo de un dashboard interactivo que gestiona y visualiza información proveniente de una base de datos de aeropuertos.<br />
           Además, se integra con una API externa para mantener actualizado el registro de los vuelos. <br />
           Esta herramienta tiene como objetivo facilitar la consulta, análisis y monitoreo de la información aeroportuaria en una sola interfaz intuitiva.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Objetivo Principal
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          • Diseñar e implementar un modelo relacional que estructure la información clave sobre aeropuertos.<br />
          <br />
          • Permitir operaciones CRUD (crear, leer, actualizar, eliminar) sobre los registros de la base de datos.<br />
          <br />
          • Conectar e integrar una API externa que proporcione datos actualizados (por ejemplo, clima o vuelos).<br />
          <br />
          • Visualizar de manera clara e interactiva los datos históricos y en tiempo real mediante gráficos o tablas.<br />
          <br />
          • Facilitar la búsqueda y filtrado de información según criterios definidos por el usuario.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Objetivos Secundarios:"Titulos del objetico, como la idea principal resumida"
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"}>
            bli bli bli bli
            <List dense sx={{ py: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Fuente primaria:</strong>
                      <Link
                        href="https://aerodatabox.com"
                        target="_blank"
                        sx={{ ml: 1 }}
                      >
                        Aerodatabox API
                      </Link>
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="• Metodología: Limpieza con OpenRefine y Python" />
              </ListItem>
            </List>

          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Otro objertivo "Titulos del objetico, como la idea principal resumida":
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={"div"}>
            Parla
            Parla
            <p style={{ margin: '4px 0' }}>
              <strong>Procesamiento de datos:</strong>
            </p>
            <ul>
              <li>Normalización de fechas UTC.</li>
              <li>Filtrado de vuelos cancelados.</li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion falseExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Referencias: Api y  Dataset
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
