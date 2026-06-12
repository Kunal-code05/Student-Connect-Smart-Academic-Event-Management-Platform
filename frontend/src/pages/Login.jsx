import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/login', form);   // send request to backend
            login(res.data); // Saves token, role, and name in local storage
            navigate('/dashboard');
        } catch (err) {
            alert("Login Failed: Please check your email and password.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login to CDAC Connect</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="CDAC Email" 
                        style={styles.input}
                        onChange={e => setForm({...form, email: e.target.value})} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={styles.input}
                        onChange={e => setForm({...form, password: e.target.value})} 
                        required 
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p>New student? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
    card: { padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '10px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};