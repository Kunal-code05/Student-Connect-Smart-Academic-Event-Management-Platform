import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Resources from './pages/Resources';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/" />;
};

function AppContent() {
    const { user, logout } = useContext(AuthContext);

    return (
        <Router>
            <nav style={styles.nav}>
                <div style={{fontSize: '20px', fontWeight: 'bold'}}>🎓 CDAC Connect</div>
                <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                    {user && (
                        <>
                            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                            <Link to="/events" style={styles.link}>Notice</Link>
                            <Link to="/resources" style={styles.link}>Resources</Link>
                            <div style={styles.userBadge}>
                                {user.role === 'admin' ? '🛡️ Faculty' : '👨‍🎓 Student'}: {user.name}
                            </div>
                            <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                        </>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 5%', background: '#2c3e50', color: 'white', alignItems: 'center' },
    link: { color: 'white', textDecoration: 'none', fontWeight: '500' },
    userBadge: { background: '#34495e', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' },
    logoutBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor:'pointer' }
};

export default function App() {
    return <AuthProvider><AppContent /></AuthProvider>;
}