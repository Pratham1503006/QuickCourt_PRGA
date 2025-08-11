import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

const DatabaseViewer = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { key: 'users', label: 'Users', endpoint: '/api/users' },
    { key: 'bookings', label: 'Bookings', endpoint: '/api/bookings' },
    { key: 'venues', label: 'Venues', endpoint: '/api/venues' }
  ];

  const fetchData = async (endpoint, key) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}${endpoint}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch data');
      }
      
      setData(prev => ({
        ...prev,
        [key]: result.data || []
      }));
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = (tab) => {
    if (!data[tab.key]) {
      fetchData(tab.endpoint, tab.key);
    }
  };

  useEffect(() => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    if (activeTabData) {
      loadTabData(activeTabData);
    }
  }, [activeTab]);

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className={value ? 'text-green-600' : 'text-red-600'}>{value.toString()}</span>;
    }
    
    if (typeof value === 'object') {
      return <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(value, null, 2)}</pre>;
    }
    
    return <span className="text-gray-900">{value.toString()}</span>;
  };

  const renderTable = (tableData) => {
    if (!tableData || tableData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      );
    }

    const columns = Object.keys(tableData[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column} className="px-4 py-3 text-sm border-b max-w-xs">
                    <div className="truncate">
                      {formatValue(row[column])}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const refreshData = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    if (activeTabData) {
      // Force refresh by removing cached data
      setData(prev => {
        const newData = { ...prev };
        delete newData[activeTab];
        return newData;
      });
      fetchData(activeTabData.endpoint, activeTab);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>
          
          <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Database Viewer</h1>
                <p className="text-gray-600 mt-1">View data stored in the QuickCourt database</p>
              </div>
              <Button onClick={refreshData} variant="outline">
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {data[tab.key] && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {data[tab.key].length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading data...</span>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {tabs.find(tab => tab.key === activeTab)?.label} Data
                  </h2>
                  {data[activeTab] && (
                    <span className="text-sm text-gray-500">
                      {data[activeTab].length} record(s) found
                    </span>
                  )}
                </div>
                
                {renderTable(data[activeTab])}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How to use this viewer:</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Click on different tabs to view different types of data</li>
            <li>• Use the "Refresh Data" button to reload the latest data from the database</li>
            <li>• Register new users or create bookings to see new data appear here</li>
            <li>• The database is persisted in SQLite at: backend/data/quickcourt.db</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DatabaseViewer;
