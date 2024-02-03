import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import jsonData from './Components/data.json';
import './App.css';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const [data, setData] = useState(jsonData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = () => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const slicedData = jsonData.slice(startIndex, endIndex);
      setData(slicedData);
      setTotalPages(Math.ceil(jsonData.length / ITEMS_PER_PAGE));
    };

    fetchData();
  }, [currentPage]);

  const handleCheckboxChange = (rowId) => {
    const updatedSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];
    setSelectedRows(updatedSelectedRows);
  };

  const tableRows = data.map((row) => (
    <tr key={row.ID}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.includes(row.ID)}
          onChange={() => handleCheckboxChange(row.ID)}
        />
      </td>
      <td>{row.ID}</td>
      <td>{row.Name}</td>
      <td>{row["Value 1"]}</td>
      <td>{row["Value 2"]}</td>
    </tr>
  ));

  const chartData = selectedRows.map((userId) => ({
    x: [data.find((row) => row.ID === userId)?.["Value 1"] || 0, data.find((row) => row.ID === userId)?.["Value 1"] || 0],
    y: [0, data.find((row) => row.ID === userId)?.["Value 2"] || 0],
    type: 'scatter',
    mode: 'lines',
    line: { color: 'blue', width: 5 },
    name: data.find((row) => row.ID === userId)?.Name || '',
  }));

  return (
    <div className="app-container">
      <div className="table-container">
        <h1>Hello, Users</h1>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Value 1</th>
              <th>Value 2</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
        <br />
        <br />
        <div className="pagination-container">
          <button onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}>
            Previous Page
          </button>
          <span>Page {currentPage}</span>
          <button onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}>
            Next Page
          </button>
        </div>
      </div>
      <div className="chart-container">
        <Plot
          data={chartData}
          layout={{
            width: '100%',
            height: '100%',
            title: 'Vertical Line Chart',
            xaxis: { showgrid: false, zeroline: false },
            yaxis: { showgrid: false, zeroline: false },
            margin: { t: 0 },
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    </div>
  );
};

export default App;
