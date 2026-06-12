import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/register', form);
            alert("Registration Successful! Now you can Login.");
            navigate('/');
        } catch (err) { 
            alert("Registration failed. Try a different email."); 
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <h2 style={{textAlign:'center', color:'#2c3e50'}}>CDAC Register</h2>
                
                <input type="text" placeholder="Full Name" style={styles.input}
                    onChange={e => setForm({...form, name: e.target.value})} required />
                
                <input type="email" placeholder="CDAC Email" style={styles.input}
                    onChange={e => setForm({...form, email: e.target.value})} required />
                
                <input type="password" placeholder="Password" style={styles.input}
                    onChange={e => setForm({...form, password: e.target.value})} required />
                
                <label style={{fontSize:'14px', color:'#7f8c8d'}}>Select Your Role:</label>
                <select style={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty (Admin)</option>
                </select>
                
                <button type="submit" style={styles.btn}>Sign Up</button>
                <p style={{textAlign:'center', fontSize:'14px'}}>
                    Already have an account? <span onClick={()=>navigate('/')} style={{color:'#2980b9', cursor:'pointer'}}>Login</span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: { display:'flex', justifyContent:'center', alignItems:'center', height:'90vh', background:'#f4f7f6' },
    card: { display:'flex', flexDirection:'column', gap:'15px', width:'380px', padding:'40px', background:'#fff', borderRadius:'12px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)' },
    input: { padding:'12px', borderRadius:'6px', border:'1px solid #ddd', outline:'none' },
    btn: { padding:'12px', background:'#27ae60', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' }
};