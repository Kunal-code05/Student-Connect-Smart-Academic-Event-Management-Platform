import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [announcements, setAnnouncements] = useState([]);
    const [resources, setResources] = useState([]);
    const [quote, setQuote] = useState({ text: "Excellence is a habit.", author: "Aristotle" });

    useEffect(() => {
        fetchData();
        // Fetch Quote
        fetch('https://dummyjson.com/quotes/random')
            .then(res => res.json())
            .then(data => setQuote({ text: data.quote, author: data.author }));
    }, []);

    const fetchData = async () => {
        try {
            const annRes = await API.get('/announcements');
            setAnnouncements(annRes.data);
            const resRes = await API.get('/resources');
            setResources(resRes.data);
            // Event fetch removed from here
        } catch (err) { console.log(err); }
    };

    return (
        <div style={styles.container}>
            
            {/* --- TOP ROW: STATS CARDS (Updated to 2 columns) --- */}
            <div style={styles.statsRow}>
                <div style={{ ...styles.statCard, borderBottom: '4px solid #3498db' }}>
                    <span style={styles.statIcon}>📢</span>
                    <div>
                        <div style={styles.statNum}>{announcements.length}</div>
                        <div style={styles.statLabel}>Latest CDAC Notices</div>
                    </div>
                </div>
                <div style={{ ...styles.statCard, borderBottom: '4px solid #27ae60' }}>
                    <span style={styles.statIcon}>📚</span>
                    <div>
                        <div style={styles.statNum}>{resources.length}</div>
                        <div style={styles.statLabel}>Available Resources</div>
                    </div>
                </div>
            </div>

            <div style={styles.mainGrid}>
                
                {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                <div style={styles.leftCol}>
                    <div style={styles.quoteBox}>
                        <p style={{ margin: 0, fontSize: '18px', color: '#2c3e50', fontWeight: '500' }}>"{quote.text}"</p>
                        <small style={{ color: '#7f8c8d' }}>— {quote.author}</small>
                    </div>

                    <h3 style={styles.sectionTitle}>📢 Recent Announcements</h3>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {announcements.map(a => (
                            <div key={a.id} style={styles.announcementCard}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{a.title}</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.4' }}>{a.content}</p>
                                <small style={{ color: '#aaa', display: 'block', marginTop: '10px' }}>
                                    📅 {new Date(a.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: SIDEBAR --- */}
                <div style={styles.rightCol}>
                    <div style={styles.profileCard}>
                        <img 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                            alt="avatar" 
                            style={styles.avatar} 
                        />
                        <h4 style={{ margin: '15px 0 5px 0', color: '#2c3e50' }}>{user.name}</h4>
                        <span style={styles.roleTag}>{user.role === 'admin' ? 'FACULTY' : 'STUDENT'}</span>
                        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
                        <div style={{ textAlign: 'left', fontSize: '13px', color: '#555' }}>
                            <p style={{marginBottom:'10px'}}> {user.email}</p>
                            <p>🏫 CDAC Training Center</p>
                        </div>
                    </div>

                    <div style={styles.quickLinks}>
                        <h4 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>📖 New Resources</h4>
                        {resources.slice(0, 4).map(r => (
                            <a key={r.id} href={r.link} target="_blank" rel="noreferrer" style={styles.resourceLink}>
                                📄 {r.title.length > 25 ? r.title.substring(0, 25) + '...' : r.title}
                            </a>
                        ))}
                        {resources.length === 0 && <p style={{fontSize:'12px', color:'#999'}}>No resources yet.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: { padding: '30px 8%', background: '#f8fafb', minHeight: '92vh' },
    
    // Stats Grid - Now 2 Columns
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '35px' },
    statCard: { 
        background: '#fff', 
        padding: '25px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '25px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    },
    statIcon: { fontSize: '35px' },
    statNum: { fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' },
    statLabel: { color: '#95a5a6', fontSize: '14px', fontWeight: '500' },

    mainGrid: { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '35px' },
    
    // Left Content
    leftCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
    quoteBox: { 
        background: '#fff', 
        padding: '30px', 
        borderRadius: '15px', 
        borderLeft: '10px solid #3498db', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)' 
    },
    sectionTitle: { margin: '10px 0', color: '#2c3e50', fontWeight: '600' },
    announcementCard: { 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #f1f1f1', 
        marginBottom: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
    },

    // Right Content
    rightCol: { display: 'flex', flexDirection: 'column', gap: '25px' },
    profileCard: { 
        background: '#fff', 
        padding: '10px', 
        borderRadius: '20px', 
        textAlign: 'center', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #f1f1f1'
    },
    avatar: { width: '90px', height: '90px', borderRadius: '50%', background: '#f8f9fa', border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    roleTag: { background: '#2c3e50', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' },
    
    quickLinks: { 
        background: '#fff', 
        padding: '15px', 
        borderRadius: '20px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #f1f1f1'
    },
    resourceLink: { 
        display: 'block', 
        padding: '12px 0', 
        color: '#2980b9', 
        textDecoration: 'none', 
        fontSize: '14px', 
        borderBottom: '1px solid #f9f9f9',
        fontWeight: '500'
    }
};