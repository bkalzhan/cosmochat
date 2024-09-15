import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ActivityDashboard({ sessions }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupSessionsByMinute = () => {
      const sessionCounts = {};

      // Get the current time
      const now = new Date();
      
      // Initialize session counts for the last 7 minutes
      for (let i = 0; i < 7; i++) {
        const minuteLabel = new Date(now.getTime() - i * 60000).toLocaleTimeString('en-US', { minute: '2-digit' });
        sessionCounts[minuteLabel] = 0;
      }

      // Iterate over sessions and check which fall within the last 7 minutes
      sessions.forEach((session) => {
        const lastMessageTime = new Date(session.lastMessageTime);
        const diffInMinutes = Math.floor((now - lastMessageTime) / 60000); // Difference in minutes

        if (diffInMinutes < 7) {
          const minuteLabel = lastMessageTime.toLocaleTimeString('en-US', { minute: '2-digit' });
          sessionCounts[minuteLabel] += 1;
        }
      });

      // Prepare the data for the chart
      setChartData({
        labels: Object.keys(sessionCounts).reverse(), // Display minutes in the correct order
        datasets: [
          {
            label: 'Sessions in the Last 7 Minutes',
            data: Object.values(sessionCounts).reverse(),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
      setLoading(false);
    };

    groupSessionsByMinute();  // Update chart whenever sessions data changes
  }, [sessions]);  // Depend on sessions to re-calculate the chart data

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Activity for the Last 7 Minutes' },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0 // Ensure whole numbers
              }
            }
          }
        }}
      />
    </div>
  );
}

export default ActivityDashboard;
