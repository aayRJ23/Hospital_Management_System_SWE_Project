import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Required for Chart.js v3
import { Chart, registerables } from 'chart.js';
import { motion } from "framer-motion";

Chart.register(...registerables);

const PieChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-center"
      style={{ width: '300px', height: '300px' }} // Adjust dimensions
    >
      <Pie
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                font: {
                  size: 14,
                  family: "Arial, sans-serif",
                  weight: "bold",
                },
                color: "#444",
                padding: 20,
                boxWidth: 20,
                boxHeight: 20,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
          },
        }}
      />
    </motion.div>
  );
};

export default PieChart;
