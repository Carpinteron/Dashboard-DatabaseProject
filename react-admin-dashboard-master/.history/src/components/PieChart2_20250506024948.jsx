import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const fixedColors = ["#4FC3F7", "#81C784", "#BA68C8", "#FFB74D", "#90A4AE"];

  useEffect(() => {
    document.title = "Line Chart - Skylar";
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/vuelos-enero-mayo-2025");
        const json = await res.json();

        const currentYear = new Date().getFullYear();
        const ultimos5Anios = json.data.filter((item) => item.Año >= currentYear - 4);

        const formattedData = [
          {
            id: "Cantidad",
            data: ultimos5Anios.map((item) => ({
              x: item.Año.toString(),
              y: item.Cant_Vuelos,
            })),
          },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveLine
      data={data}
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
        tooltip: { container: { color: colors.primary[500] } },
      }}
      colors={fixedColors}
      margin={{ top: 40, right: 110, bottom: 70, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: -90,
        legend: "Año",
        legendOffset: 43,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 6,
        tickRotation: 0,
        legend: "Cantidad de Vuelos",
        legendOffset: -44,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={6}
      pointColor={{ from: "serieColor" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      lineAriaLabel={(e) => `${e.id}: ${e.formattedValue} in year: ${e.indexValue}`}
    />
  );
};

export default LineChart;
