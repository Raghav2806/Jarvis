import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data, chartTitle }) => {
    const palette8 = [
  '#424874', // deep indigo
  '#A6B1E1', // lavender blue
  '#DCD6F7', // soft lilac
  '#F4EEFF', // lightest lavender
  '#4B5D67', // muted slate
  '#7D98A1', // desaturated blue
  '#E2D1F9', // soft orchid
  '#C1CAD6'  // pale slate-gray
];

    const palette16 = [
  '#2E3159', // deep indigo
  '#3C3F6E',
  '#424874',
  '#5A5E92',
  '#7374A8',
  '#8C8ABE',
  '#A6B1E1',
  '#B8BFF0',
  '#C9CCF4',
  '#DCD6F7',
  '#E3DDF9',
  '#EAE3FB',
  '#F0E9FD',
  '#F4EEFF',
  '#F9F4FF',
  '#FFFFFF'
];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563',
        },
      },
    },
  };

  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Amount',
        data: data.map(item => item.total),
        backgroundColor: data.length>8?palette16.slice(0,data.length):palette8.slice(0,data.length),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md max-w-md w-full mx-auto">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{chartTitle}</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
