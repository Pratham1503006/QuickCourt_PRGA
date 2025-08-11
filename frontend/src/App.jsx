import { useState, useEffect } from 'react';

function App() {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/db-status")
            .then((res) => res.json())
            .then((data) => setStatus(data));
    }, []);

    return (
        <div>
            <h1>Database Connection Status</h1>
            {status === null ? (
                <p>Checking...</p>
            ) : status.connected ? (
                <div>
                    <p style={{ color: "green" }}>Connected</p>
                    <h2>Users Table Data:</h2>
                    {status.data && status.data.length > 0 ? (
                        <table border="1" cellPadding="5">
                            <thead>
                                <tr>
                                    {Object.keys(status.data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {status.data.map((row, idx) => (
                                    <tr key={idx}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{String(value)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data found.</p>
                    )}
                </div>
            ) : (
                <p style={{ color: "red" }}>Not Connected: {status.error}</p>
            )}
        </div>
    );
}

export default App;