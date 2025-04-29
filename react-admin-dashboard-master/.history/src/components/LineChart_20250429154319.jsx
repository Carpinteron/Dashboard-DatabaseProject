import { ResponsiveLine } from '@nivo/line';
import { lineChartFlightFareData } from '../data/mockData';

const DualAxisLineChart = () => {
  return (
    <div style={{ height: '500px' }}>
      <ResponsiveLine
        data={lineChartFlightFareData.map(serie => ({
          ...serie,
          yAxisId: serie.id === "Tarifa Promedio" ? "right" : "left"
        }))}
        margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          stacked: false,
        }}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Año',
          legendOffset: 40,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Cantidad de Vuelos',
          legendOffset: -50,
          legendPosition: 'middle'
        }}
        axisRight={{
          orient: 'right',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Tarifa Promedio',
          legendOffset: 50,
          legendPosition: 'middle'
        }}
        enableSlices="x"
        pointSize={6}
        pointBorderWidth={2}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 4,
            itemDirection: 'left-to-right',
            itemWidth: 120,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          }
        ]}
        yFormat={value => Math.round(value)}
        lineWidth={3}
      />
    </div>
  );
};

export default DualAxisLineChart;
