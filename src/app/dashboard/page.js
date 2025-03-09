"use client"

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Box, Container, Typography, MenuItem, Select, Button, Switch, FormControlLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2023');
  const [month, setMonth] = useState('January');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictedData, setPredictedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSheetsData');
        const result = await response.json();
        setData(result);
        
        // If predictions are enabled, fetch them immediately after getting the data
        if (showPredictions) {
          const processedData = processData(result);
          fetchPredictions(processedData.lineData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showPredictions]);

  const fetchPredictions = async (historicalData) => {
    try {
      const response = await fetch('/api/getPredictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historicalData }),
      });
      const predictions = await response.json();
      setPredictedData(predictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePredictionToggle = (event) => {
    setShowPredictions(event.target.checked);
  };

  const processData = (data) => {
    const filteredData = data.slice(4);

    const lineData = filteredData.filter(row => row[1] && row[1].includes(year)).map(row => ({
      date: row[1],
      consumption: parseFloat(row[7]),
      solar: parseFloat(row[5]),
      otherSources: parseFloat(row[7]) - parseFloat(row[5]),
      savings: parseFloat(row[15]),
      price: parseFloat(row[19]),
      solarPercentage: parseFloat(row[8]),
      totalSavings: parseFloat(row[14]),
      htc179: parseFloat(row[0]),
      htc232: parseFloat(row[2]),
      totalGED: parseFloat(row[3]),
      solarCapex: parseFloat(row[4]),
      solarOpex: parseFloat(row[6]),
      c2kWh: parseFloat(row[9]),
      c2SolarPercentage: parseFloat(row[10]),
      rsPerKWh: parseFloat(row[11]),
      savingsFrom1MWpSolar: parseFloat(row[12]),
      savingsFromCapex: parseFloat(row[13]),
      htc179Amount: parseFloat(row[16]),
      htc232Amount: parseFloat(row[17]),
      totalAmount: parseFloat(row[18])
    }));

    const pieData = lineData.filter(row => row.date.includes(month)).map(row => ({
      name: 'Solar',
      value: row.solar
    })).concat(lineData.filter(row => row.date.includes(month)).map(row => ({
      name: 'Other Sources',
      value: row.otherSources
    })));

    return { lineData, pieData };
  };

  const { lineData, pieData } = processData(data);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    signIn('google');
    return null;
  }

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <Container sx={{ color: 'white', backgroundColor: 'black', padding: '20px', borderRadius: '10px' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: 'linear-gradient(45deg, #82ca9d, #0069ff)',
          borderRadius: '10px',
          transition: 'background 0.3s, color 0.3s',
          '&:hover': {
            background: 'linear-gradient(45deg,#75917f, #719fe1)',
            color: 'black',
          },
        }}
      >
        Energy Consumption Dashboard
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Select value={year} onChange={handleYearChange} sx={{ color: 'white', backgroundColor: 'black' }}>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Switch
              checked={showPredictions}
              onChange={handlePredictionToggle}
              color="primary"
            />
          }
          label="Show Predictions"
          sx={{ color: 'white' }}
        />
      </Box>

      {currentPage === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Consumption (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Actual Consumption" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="consumption" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Consumption"
                  />
                )}
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Solar Generation (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="solar" stroke="#82ca9d" name="Actual Solar" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="solar" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Solar"
                  />
                )}
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Non-solar sources (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="otherSources" stroke="#ff7300" name="Other Sources" />
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings from Capex (Rs)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke="#82ca9d" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Solar (kWh)</Typography>
              <AreaChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="solarPercentage" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings from Solar (Rs)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSavings" stroke="#ff7300" />
              </LineChart>
            </Box>
          </Box>
        </>
      )}
      {currentPage === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>HTC 179 and HTC 232</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="htc179" fill="#8884d8" name="HTC 179" />
                <Bar dataKey="htc232" fill="#82ca9d" name="HTC 232" />
              </BarChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total GED</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalGED" stroke="#ff7300" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Solar Capex and Opex</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="solarCapex" fill="#8884d8" name="Solar Capex" />
                <Bar dataKey="solarOpex" fill="#82ca9d" name="Solar Opex" />
              </BarChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>C2 kWh and Solar Percentage of C2</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="c2kWh" stroke="#ff7300" name="C2 kWh" />
                <Line type="monotone" dataKey="c2SolarPercentage" stroke="#82ca9d" name="Solar Percentage of C2" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Rs/kWh</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rsPerKWh" stroke="#ff7300" />
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Savings from 1 MWp Solar and Capex</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="savingsFrom1MWpSolar" fill="#8884d8" name="Savings from 1 MWp Solar" />
                <Bar dataKey="savingsFromCapex" fill="#82ca9d" name="Savings from Capex" />
              </BarChart>
            </Box>
          </Box>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Page 1
        </Button>
        <Button variant="contained" onClick={() => handlePageChange(2)} disabled={currentPage === 2} sx={{ ml: 2 }}>
          Page 2
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;