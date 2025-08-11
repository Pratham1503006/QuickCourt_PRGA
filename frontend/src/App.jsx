import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('login');

    // Check for existing login
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleSignupSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setAuthMode('login');
    };

    const handleSwitchAuthMode = (mode) => {
        setAuthMode(mode);
    };

    if (user) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <div className="app">
            <div className="auth-container">
                {authMode === 'login' ? (
                    <Login 
                        onSwitch={handleSwitchAuthMode}
                        onLoginSuccess={handleLoginSuccess}
                    />
                ) : (
                    <Signup 
                        onSwitch={handleSwitchAuthMode}
                        onSignupSuccess={handleSignupSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default App;