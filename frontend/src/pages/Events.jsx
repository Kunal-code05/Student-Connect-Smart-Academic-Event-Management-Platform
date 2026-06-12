import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Events() {
    const { user } = useContext(AuthContext);
    
    // States
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnn, setNewAnn] = useState({ title: '', content: '' });

    // --- NEW STATES FOR UPDATE LOGIC ---
    const [editingId, setEditingId] = useState(null); // Stores ID of the card being edited
    const [editForm, setEditForm] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const eventRes = await API.get('/events');
            setEvents(eventRes.data);
            
            const annRes = await API.get('/announcements');
            setAnnouncements(annRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await API.post('/announcements', newAnn);
            setNewAnn({ title: '', content: '' });
            alert("Notice Published!");
            fetchAllData(); 
        } catch (err) {
            alert("Post failed. Admin access required.");
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm("Delete this notice?")) {
            await API.delete(`/announcements/${id}`);
            fetchAllData();
        }
    };

    // --- NEW: START EDIT MODE ---
    const startEditing = (ann) => {
        setEditingId(ann.id);
        setEditForm({ title: ann.title, content: ann.content });
    };

    // --- NEW: HANDLE UPDATE ---
    const handleUpdateAnnouncement = async (id) => {
        try {
            await API.put(`/announcements/${id}`, editForm);
            setEditingId(null); // Exit edit mode
            alert("Notice Updated!");
            fetchAllData(); 
        } catch (err) {
            alert("Update failed!");
        }
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            await API.post(`/events/${eventId}/register`, { userId: user.id });
            alert("Success! You are joined.");
            fetchAllData();
        } catch (err) {
            alert("Registration failed.");
        }
    };

    return (
        <div style={styles.container}>
            
            {/* --- SECTION 1: POST ANNOUNCEMENT (FACULTY ONLY) --- */}
            {user && user.role === 'admin' && (
                <div style={styles.postBox}>
                    <h4 style={styles.sectionHeader}>📢 Notice Announcement</h4>
                    <form onSubmit={handlePostAnnouncement} style={styles.formInline}>
                        <input 
                            placeholder="Headline" 
                            value={newAnn.title} 
                            style={styles.input}
                            onChange={e => setNewAnn({...newAnn, title: e.target.value})} 
                            required 
                        />
                        <input 
                            placeholder="Details" 
                            value={newAnn.content} 
                            style={{ ...styles.input, flex: 2 }}
                            onChange={e => setNewAnn({...newAnn, content: e.target.value})} 
                            required 
                        />
                        <button type="submit" style={styles.postBtn}>Post</button>
                    </form>
                </div>
            )}

            {/* --- SECTION 2: UPCOMING CDAC EVENTS --- */}
            <div style={styles.eventList}>
                {events.map(e => (
                    <div key={e.id} style={styles.eventCard}>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{e.title}</h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{e.description}</p>
                            <small style={{ color: '#2980b9' }}>📍 {e.location} | 🕒 {e.date}</small>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}><b>{e.Users?.length || 0} Registered</b></p>
                            {user.role === 'student' && (
                                <button onClick={() => handleRegisterEvent(e.id)} style={styles.regBtn}>Join</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SECTION 3: RECENT CDAC NOTICES (4 CARDS PER LINE) --- */}
            <h3 style={{ ...styles.title, marginTop: '40px' }}>📌 Recent CDAC Notices</h3>
            <div style={styles.noticeGrid}>
                {announcements.map(a => (
                    <div key={a.id} style={styles.noticeCard}>
                        
                        {editingId === a.id ? (
                            /* --- RENDER EDIT FORM IF THIS CARD IS SELECTED --- */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input 
                                    style={styles.editInput} 
                                    value={editForm.title} 
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                />
                                <textarea 
                                    style={{ ...styles.editInput, minHeight: '50px' }} 
                                    value={editForm.content} 
                                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                                />
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleUpdateAnnouncement(a.id)} style={styles.saveBtn}>Save</button>
                                    <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            /* --- RENDER NORMAL CARD VIEW --- */
                            <>
                                <div style={styles.cardHeader}>
                                    <strong style={{ fontSize: '15px', color: '#2c3e50' }}>{a.title}</strong>
                                    {user.role === 'admin' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => startEditing(a)} style={styles.editIconBtn} title="Edit Notice">✏️</button>
                                            <button onClick={() => handleDeleteAnnouncement(a.id)} style={styles.delBtn}>×</button>
                                        </div>
                                    )}
                                </div>
                                <p style={styles.cardBody}>{a.content}</p>
                                <div style={styles.cardFooter}>
                                    📅 {new Date(a.createdAt).toLocaleDateString()}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '30px 5%', fontFamily: 'Arial, sans-serif' },
    postBox: { padding: '20px', border: '1px solid #eee', borderRadius: '10px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' },
    sectionHeader: { margin: '0 0 15px 0', color: '#2c3e50' },
    formInline: { display: 'flex', gap: '10px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' },
    postBtn: { background: '#2c3e50', color: 'white', border: 'none', padding: '0 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    title: { borderBottom: '2px solid #34495e', paddingBottom: '10px', marginBottom: '20px', color: '#2c3e50' },
    eventList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    eventCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '8px' },
    regBtn: { background: '#27ae60', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' },
    noticeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
    noticeCard: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardBody: { fontSize: '13px', color: '#555', margin: '10px 0', lineHeight: '1.4' },
    cardFooter: { fontSize: '11px', color: '#aaa', textAlign: 'right' },
    delBtn: { border: 'none', background: 'none', color: '#e74c3c', fontSize: '20px', cursor: 'pointer', lineHeight: '1' },
    
    // --- NEW EDIT STYLES ---
    editIconBtn: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', padding: '0' },
    editInput: { padding: '8px', fontSize: '13px', border: '1px solid #3498db', borderRadius: '4px', outline: 'none' },
    saveBtn: { background: '#27ae60', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
    cancelBtn: { background: '#95a5a6', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }
};