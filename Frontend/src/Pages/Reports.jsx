import React, { useEffect } from 'react'
import Sidebar from '../Components/sidebar'
import Topbar from '../Components/Topbar'
import Cards from '../Components/Cards'
import '../Pages/Reports.css'
import { useState } from 'react'
import { FaFileExport } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer, } from "recharts";
import axios from 'axios'

const Reports = ({ onlogout ,user,role }) => {
  const [filter, setfilter] = useState("")
  const [showExport, setShowExport] = useState(false)
  const [ProductData, setProductData] = useState([])


  async function getdata() {
    const products = await axios.get(`http://localhost:4000/api/products`)
    setProductData(products.data.products);
  
  }
async function exportPdf() {
  try {
    const response = await axios.get("http://localhost:4000/api/reports/export-pdf", {
      responseType: "blob",
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ PDF Report downloaded successfully!");
  } catch (error) {
    console.error("PDF download failed:", error);
    alert("❌ Failed to download PDF report.");
  }
}

async function exportExcel() {
  try {
    const response = await axios.get("http://localhost:4000/api/reports/export-excel", {
      responseType: "blob",
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Excel Report downloaded successfully!");
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("❌ Failed to download Excel report.");
  }
}

  const totalProducts = ProductData.length;
  const lowStock = ProductData.filter((p) => p.qty <= 5).length;
  const inventoryValue = ProductData.reduce((s, p) => s + p.qty * p.price, 0);


  const stockByCategory = (() => {
    const map = {};
    ProductData.forEach((p) => {
      map[p.c_id?.name] = (map[p.c_id?.name] || 0) + p.qty;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  
  let lineSeries = [];
  if (filter === "Daily") {
    lineSeries = [
      { day: "Mon", value: inventoryValue * 0.9 },
      { day: "Tue", value: inventoryValue * 0.95 },
      { day: "Wed", value: inventoryValue },
    ];
  } else if (filter === "Monthly") {
    lineSeries = [
      { day: "Jan", value: inventoryValue * 0.6 },
      { day: "Feb", value: inventoryValue * 0.8 },
      { day: "Mar", value: inventoryValue },
    ];
  } else {
    lineSeries = [
      { day: "2022", value: inventoryValue * 0.2 },
      { day: "2023", value: inventoryValue * 0.5 },
      { day: "2024", value: inventoryValue },
    ];
  }

  const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"];


  useEffect(() => {
    getdata()
  }, [])


  return (
    <>
      <div className="wrapper">
        <Sidebar onlogout={onlogout} role={role}/>


        <div className="main-content">
          <div className="reports-topbar-container">
            <Topbar data={"Reports"} onlogout={onlogout} user={user} />
          </div>




          <div className="reports-actionButtons actionButtons">
            <div className="filter-wrapper">
              <label>Filter: </label>
              <select value={filter} onChange={(e) => setfilter(e.target.value)}>
                <option>Daily</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>

            <div className="export-dropdown-wrapper">
              <button className="export-btn" onClick={() => setShowExport(!showExport)}>
                <FaFileExport /> Export ▼
              </button>
              {showExport && (
                <ul className="export-dropdown">
                  <li onClick={() => exportExcel()}>Export to Excel</li>
                  <li onClick={() => exportPdf()}>Export to PDF</li>
                </ul>
              )}
            </div>

          </div>

          <div className="reports-card-container">
            <Cards />
          </div>

          <div className="reports-grid">
            {/* Pie Chart */}
            <div className="chart-card">
              <h4>Stock by Category</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={stockByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    label
                  >
                    {stockByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="chart-card">
              <h4>Inventory Value ({filter})</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={lineSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1a73e8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          
            
          </div>


        </div>

      </div>

    </>


  )
}

export default Reports