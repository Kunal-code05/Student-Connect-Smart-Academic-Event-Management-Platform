import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Resources() {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState("");
    const [newItem, setNewItem] = useState({ title: '', link: '', category: 'PDF' });

    useEffect(() => {
        fetchResources();
    }, [search]); 

    const fetchResources = async () => {
        try {
            const res = await API.get(`/resources?search=${search}`);
            setResources(res.data);
        } catch (err) {
            console.error("Fetch resources failed", err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/resources', newItem);
            alert("Resource Link Shared!");
            setNewItem({ title: '', link: '', category: 'PDF' });
            fetchResources(); 
        } catch (err) {
            alert("Upload failed. Only Faculty can add resources.");
        }
    };

    const handleDelete = async (resourceId) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                // Ensure your token is being sent via the API interceptor in api.js
                await API.delete(`/resources/${resourceId}`);
                alert("Resource removed successfully!");
                fetchResources(); // Refresh the list
            } catch (err) {
                console.error(err);
                alert("Delete failed. Action restricted to Faculty.");
            }
        }
    };

    return (
        <div style={{ padding: '30px 10%', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2c3e50' }}>📚 Study Resources</h2>
            
            <input 
                type="text" 
                placeholder="🔍 Search resources (e.g. Java, DBMS)..." 
                style={styles.searchInput} 
                onChange={e => setSearch(e.target.value)}
            />

            {/* --- FACULTY ONLY: ADD RESOURCE FORM --- */}
            {user && user.role === 'admin' && (
                <div style={styles.uploadBox}>
                    <h4 style={{ marginTop: 0 }}>Upload New Resource Link (Faculty)</h4>
                    <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            placeholder="Title (e.g. Java Notes)" 
                            value={newItem.title} 
                            style={styles.input}
                            onChange={e => setNewItem({...newItem, title: e.target.value})} 
                            required 
                        />
                        <input 
                            placeholder="URL Link (Drive/Web)" 
                            value={newItem.link} 
                            style={styles.input}
                            onChange={e => setNewItem({...newItem, link: e.target.value})} 
                            required 
                        />
                        <button type="submit" style={styles.addBtn}>Share Link</button>
                    </form>
                </div>
            )}

            {/* --- RESOURCE LIST --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {resources.length > 0 ? (
                    resources.map(r => (
                        <div key={r.id} style={styles.resourceCard}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{r.title}</h3>
                                <p style={{ fontSize: '13px', color: '#7f8c8d', margin: '0 0 15px 0' }}>
                                    Category: <b>{r.category}</b>
                                </p>
                                <a href={r.link} target="_blank" rel="noreferrer" style={styles.viewLink}>
                                    🔗 View Resource
                                </a>
                            </div>

                            {/* --- ROLE-BASED UI: DELETE BUTTON FOR FACULTY ONLY --- */}
                            {user && user.role === 'admin' && (
                                <button 
                                    onClick={() => handleDelete(r.id)} 
                                    style={styles.deleteBtn}
                                    title="Delete Resource"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#95a5a6' }}>No resources found matching your search.</p>
                )}
            </div>
        </div>
    );
}

// Styling Object
const styles = {
    searchInput: { 
        width: '100%', 
        padding: '14px', 
        marginBottom: '25px', 
        borderRadius: '8px', 
        border: '1px solid #ddd',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    uploadBox: { 
        padding: '20px', 
        border: '1px solid #3498db', 
        borderRadius: '10px', 
        background: '#ebf5fb', 
        marginBottom: '30px' 
    },
    input: { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    addBtn: { padding: '10px 20px', background: '#2980b9', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    
    resourceCard: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        padding: '20px', 
        background: '#fff', 
        border: '1px solid #eee', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    viewLink: { color: '#2980b9', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' },
    deleteBtn: { 
        background: 'none', 
        border: 'none', 
        fontSize: '20px', 
        cursor: 'pointer', 
        color: '#e74c3c',
        marginLeft: '15px',
        padding: '5px'
    }
};