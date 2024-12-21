// App.js
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dnsSettings, setDnsSettings] = useState([]);
  const [error, setError] = useState(null);
  const [newServer, setNewServer] = useState('');
  const [loading, setLoading] = useState(true); // Untuk menampilkan status loading

  useEffect(() => {
    fetchDNSSettings();
  }, []);

  const fetchDNSSettings = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/dns')
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setDnsSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleAddServer = () => {
    if (!newServer.trim()) {
      alert("Please enter a valid DNS server.");
      return;
    }

    fetch('http://localhost:5000/api/dns/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ server: newServer.trim() }),
    })
      .then((response) => {
        if (!response.ok) {
          // Coba parsing JSON, jika gagal kembalikan sebagai teks
          return response.text().then((text) => {
            throw new Error(text || `HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        setNewServer('');
        fetchDNSSettings();
      })
      .catch((err) => {
        alert(`Failed to add DNS server: ${err.message}`);
      });
  };

  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mikrotik DNS Settings</h1>
      </header>
      <main>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {dnsSettings.length > 0 ? (
                  dnsSettings.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>Servers</td>
                        <td>{item.servers || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td>Dynamic Servers</td>
                        <td>{item['dynamic-servers'] || 'N/A'}</td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div style={{ marginTop: '20px' }}>
              <h2>Add New DNS Server</h2>
              <input
                type="text"
                value={newServer}
                onChange={(e) => setNewServer(e.target.value)}
                placeholder="Enter new DNS server"
              />
              <button onClick={handleAddServer}>Add Server</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
