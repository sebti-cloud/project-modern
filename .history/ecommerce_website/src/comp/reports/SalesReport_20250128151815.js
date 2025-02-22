import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import './Reports.css';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reports/sales');
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de ventes:', error);
    }
  };

  const formatSalesData = () => {
    const labels = salesData.map(item => item.sales_date);
    const data = salesData.map(item => item.total_sales);

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales',
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
          hoverBorderColor: 'rgba(75, 192, 192, 1)',
          data
        }
      ]
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, []);

  return (
    <div className="sales-report">
      <h2>Rapport de Ventes</h2>
      <Bar ref={chartRef} data={formatSalesData()} />
    </div>
  );
};

export default SalesReport;
