import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns'; // Importer date-fns
import './Reports.css';

// Enregistrer les échelles et les composants nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
      console.log('Sales data received:', data); // Log pour vérifier les données reçues
      setSalesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de ventes:', error);
    }
  };

  const formatSalesData = () => {
    if (!Array.isArray(salesData)) {
      console.error('Expected salesData to be an array, but received:', salesData);
      return { labels: [], datasets: [] };
    }

    const labels = salesData.map(item => format(new Date(item.sales_date), 'yyyy-MM-dd')); // Formatter les dates pour ne montrer que la partie date
    const data = salesData.map(item => item.total_sales);

    return {
      labels,
      datasets: [
        {
          label: 'Total des Ventes',
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

  return (
    <div className="sales-report">
      <button className="back-to-home" onClick={() => window.location.href = '/admin'}>Accueil Admin</button>
      <h2>Rapport de Ventes</h2>
      <Bar ref={chartRef} data={formatSalesData()} />
    </div>
  );
};

export default SalesReport;
