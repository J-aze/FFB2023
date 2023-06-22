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
import {Line} from "react-chartjs-2";
import { lineData } from "./data";

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

export function TestResponsiveLine(color){

  const chartData = {
    labels: [],
    datasets: lineData
  }
  const options = {
    plugins: {
      legend: {
        display: false,
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
        // borderColor: "rgba(32, 68, 19 ,1)",
        fill: "start",
        backgroundColor: `rgba(${color['r']}, ${color['g']}, ${color['b']}, 0.3)`
      },
      points: {
        radius: 0,
        hitRadius: 0,
      }
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false
      }
    }
  }

  return (
    <div>
      <h2>Test Chart</h2>
      <Line data={chartData} width={600} height={120} options={options} />
    </div>
  )
}
