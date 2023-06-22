import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import React from "react";
import {Line} from "react-chartjs-2";


// Registering the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

export function ResponsiveLineChart({ chartTitle, dataset, color, queryNbr}: {chartTitle: string, dataset: any, color: {r: Number, g: Number, b: Number}, queryNbr: Number}){

  const chartData = {
    labels: [],
    datasets: dataset
  }
  const options = {
    plugins: {
      legend: {
        display: false,
      }
    },
    elements: {
      line: {
        tension: 0.1,
        borderWidth: 2,
        borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
        fill: "start",
        backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
      },
      points: {
        radius: 1,
        hitRadius: 0,
      }
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: true
      }
    }
  }

  return(
    <div>
      <span className="fs-3"> {chartTitle} </span> - <span className="fs-5"> From <span className="fst-italic">{queryNbr.toString()}</span> results.</span>
      <Line data = { chartData } width = { 600} height = { 120} options = { options } />
    </div>
  );
}
