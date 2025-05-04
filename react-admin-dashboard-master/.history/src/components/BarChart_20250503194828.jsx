import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";


const BarChart = ({ year1b, year2b, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    document.title = "Bar Chart - Skylar";
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/rutas-populares?year1=${year1b||2020}&year2=${year2b||2025}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error al cargar datos del backend:", error);
      }
    };
    const fetchData2 = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/rutas-populares?year1=2020&year2=2025`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error al cargar datos del backend:", error);
      }
    };

    if (year1b && year2b) {
      fetchData();
    }else{
      fetchData2();
    }
  }, [year1b, year2b]); // Dependencias para actualizar la gráfica cuando cambien los años.


  return (
    <ResponsiveBar
    
      data={data}
      keys={["HNL 🠮 ITO", "LAS 🠮 RNO", "SEA 🠮 RNO", "LAX 🠮 RNO", "PHX 🠮 RNO"]}
      indexBy="year"
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Passengers (Millions)",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: { itemOpacity: 1 },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={e => `${e.id}: ${e.formattedValue} in year: ${e.indexValue}`}

     

    />
    
  );
};

export default BarChart;
