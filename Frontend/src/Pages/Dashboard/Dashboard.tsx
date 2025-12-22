import './Dashboard.css';
import { useEffect, useState } from 'react';
import Loader from '../../Components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
}

export interface UserIssue {
  _id: string;
  issueUserId: string;
  issueTitle: string;
  issueDescription: string;
  issueStatus: 'open' | 'in progress' | 'closed';
  issueType: 'Network Security' | 'Application Security' | 'Endpoint Security' | 'Identity & Access Management' | 'Zero Trust' | 'Threat Hunting' | 'Incident Response' | 'SOC Operations' | 'DevSecOps' | 'API Security';
  createdAt: string;
  lastUpdatedAt: string;
}

type IssueEditForm = Partial<Pick<UserIssue, 'issueTitle' | 'issueDescription' | 'issueType' | 'issueStatus'>>;


const issueTypeOptions = [
  'Network Security',
  'Application Security',
  'Endpoint Security',
  'Identity & Access Management',
  'Zero Trust',
  'Threat Hunting',
  'Incident Response',
  'SOC Operations',
  'DevSecOps',
  'API Security',
];

const issueStatusColors = {
  open: '#0ea5e9',
  'in progress': '#ffb300',
  closed: '#0fa958',
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [alert, setAlert] = useState('');
  const [issues, setIssues] = useState<UserIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [filters, setFilters] = useState<{ title: string; type: string; date: string }>({ title: '', type: '', date: '' });
  const [issueEditing, setIssueEditing] = useState<string | null>(null); // editing issue id
  const [issueEditForm, setIssueEditForm] = useState<IssueEditForm>({});
  const [addingIssue, setAddingIssue] = useState(false);
  const [addIssueForm, setAddIssueForm] = useState<{ issueTitle: string; issueDescription: string; issueType: string }>({ issueTitle: '', issueDescription: '', issueType: '' });
  const navigate = useNavigate();

  // Helper: get token
  const getParamToken = () => {
    localStorage.getItem('token_apnisec_remember');
  };
  const UserToken =  useParams() || getParamToken;
  console.log(UserToken.user)

  // Logout: wipe token and redirect
  const logout = () => {
    localStorage.removeItem('token_apnisec_remember');
    navigate('/login');
  };

  useEffect(() => {
  const token = UserToken.user

  // If no token → wait 5 sec → logout
  if (!token) {
    const t = setTimeout(() => logout(), 5000);
    return () => clearTimeout(t);
  }

  const controller = new AbortController();

  // Wait 5 sec before verifying token
  const timer = setTimeout(() => {
    fetch('https://apni-sec.onrender.com/api/users/verify', {
      headers: { Authorization: 'Bearer ' + token },
      signal: controller.signal,
    })
      .then(async res => {
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        setTimeout(logout, 5000); // 5 sec buffer before logout
      })
      .finally(() => setLoading(false));
  }, 5000); // ⏱️ 5 seconds buffer

  return () => {
    clearTimeout(timer);
    controller.abort();
  };
}, [UserToken]);


  // Fetch issues
  useEffect(() => {
    const token = UserToken.user;
    if (!token) return;
    setIssuesLoading(true);
    fetch('https://apni-sec.onrender.com/api/users/issues', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(async res => {
        const data = await res.json();
        if (Array.isArray(data.userIssues)) setIssues(data.userIssues);
        setIssuesLoading(false);
      })
      .catch(() => {
        setAlert('Error loading your issues. Try again later.');
        setIssuesLoading(false);
      });
  }, []);

  // Filter logic
  const filteredIssues = issues.filter(issue => {
    const matchesType = filters.type ? issue.issueType === filters.type : true;
    const matchesTitle = filters.title ? issue.issueTitle.toLowerCase().includes(filters.title.toLowerCase()) : true;
    const matchesDate = filters.date ? new Date(issue.createdAt).toISOString().slice(0, 10) === filters.date : true;
    return matchesType && matchesTitle && matchesDate;
  });


  // Issue edit handler
  const handleIssueEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const token = UserToken.user;
      const res = await fetch('https://apni-sec.onrender.com/api/users/issues/update', {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: issueEditing, updateData: issueEditForm }),
      });
      console.log(res)
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setIssues(iss => iss.map(item => item._id === issueEditing ? data.issue : item));
      setAlert('Issue updated successfully');
    } catch (error) {
      console.error(error);
      setAlert('Error updating issue.');
    } finally {
      setLoading(false);
      setIssueEditing(null);
      setIssueEditForm({});
    }
  };

  // Add issue handler
  const handleAddIssue = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const token = UserToken.user;
      const res = await fetch('https://apni-sec.onrender.com/api/users/issues/new', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(addIssueForm),
      });
      const data = await res.json();
      if (res.status === 201 && data.issue) {
        setIssues(iss => [...iss, data.issue]);
        setAlert('Issue created successfully!');
        setAddingIssue(false);
        setAddIssueForm({ issueTitle: '', issueDescription: '', issueType: '' });
      } else {
        throw new Error('Not created');
      }
    } catch {
      setAlert('Could not create issue.');
    }
    setLoading(false);
  };

  // Main render
  return (
    <div className="dashboard-root">
      <header className="dashboard-navbar">
        <div className="dashboard-navcontainer">
          <div className="brand-wrap" onClick={()=>navigate('/')}
            role="button" tabIndex={0}>
            <img src="https://assets.apnisec.com/public/apnisec-ui/logo.svg" alt="ApniSec logo" className="dashboard-logo" />
            <span className="dashboard-title">Dashboard</span>
          </div>
          <div className="dashboard-profile">
  <div className="profile-trigger" tabIndex={0}>
    <span className="profile-avatar" aria-label="profile">{user && user.name ? user.name[0] : '?'}</span>
    <span className="profile-name">{user && user.name}</span>
    <button
      className="btn"
      style={{ marginLeft: '1rem', background: 'transparent', border: 'none', color: 'var(--accent1)', cursor: 'pointer' }}
      onClick={logout}
    >
      Logout
    </button>
  </div>
</div>
        </div>
      </header>
      <main className="dashboard-content">
        {alert && <div className="dashboard-alert">{alert}</div>}
        {loading ? <Loader text="Loading profile & issues..." /> : (
          <>
            {/* Issues section */}
            <section className="dashboard-issues-section">
              <div className="dashboard-issues-header">
                <h2>Your Issues</h2>
                <button className="btn btn-primary" onClick={()=>setAddingIssue(true)}>Add Issue</button>
              </div>
              <div className="dashboard-issues-filters">
                <input type="text" placeholder="Search by title" value={filters.title} onChange={e=>setFilters(f=>({...f,title:e.target.value}))} />
                <select value={filters.type} onChange={e=>setFilters(f=>({...f,type:e.target.value}))}>
                  <option value="">All Types</option>
                  {issueTypeOptions.map(type=>(<option key={type} value={type}>{type}</option>))}
                </select>
                <input type="date" value={filters.date} onChange={e=>setFilters(f=>({...f,date:e.target.value}))} />
              </div>
              {issuesLoading?
                <Loader text="Loading your issues..." /> :
                (
                  <ul className="dashboard-issues-list">
                    {filteredIssues.length===0 && <li style={{color:'#94a3b8',padding:'1.2rem'}}>No issues found.</li>}
                    {filteredIssues.map(issue => (
                      <li key={issue._id} className="dashboard-issue-item">
                        {issueEditing===issue._id ? (
                          <form className="issue-edit-form" onSubmit={handleIssueEdit}>
                            <input value={issueEditForm.issueTitle??issue.issueTitle} required onChange={e=>setIssueEditForm(f=>({...f,issueTitle:e.target.value}))} />
                            <textarea value={issueEditForm.issueDescription??issue.issueDescription} required onChange={e=>setIssueEditForm(f=>({...f,issueDescription:e.target.value}))} rows={2} />
                            <select value={issueEditForm.issueType??issue.issueType} required onChange={e=>setIssueEditForm(f=>({...f,issueType:e.target.value as UserIssue['issueType']}))}>
                              {issueTypeOptions.map(type=>(<option key={type} value={type}>{type}</option>))}
                            </select>
                            <select value={issueEditForm.issueStatus??issue.issueStatus} required onChange={e=>setIssueEditForm(f=>({...f,issueStatus:e.target.value as UserIssue['issueStatus']}))}>
                              <option value="open">Open</option>
                              <option value="in progress">In Progress</option>
                              <option value="closed">Closed</option>
                            </select>
                            <div className="edit-actions">
                              <button className="btn btn-primary" type="submit">Save</button>
                              <button type="button" className="btn" onClick={()=>{setIssueEditing(null);setIssueEditForm({})}}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <div className="issue-view-row">
                            <div className="issue-row1">
                              <span className="issue-title">{issue.issueTitle}</span>
                              <span className="issue-type" style={{background: '#1a2743',color:'#7c3aed',padding:'0.25em 0.7em',borderRadius:5,fontSize:'0.95em'}}>{issue.issueType}</span>
                              <span className="issue-status" style={{background:issueStatusColors[issue.issueStatus]||'#888',color:'#fff',padding:'0.2em 0.7em',borderRadius:5,marginLeft:8,fontSize:'0.95em'}}>{issue.issueStatus[0].toUpperCase()+issue.issueStatus.slice(1)}</span>
                            </div>
                            <div className="issue-description">{issue.issueDescription}</div>
                            <div className="issue-row2">
                              <span><strong>Created:</strong> {new Date(issue.createdAt).toLocaleString()}</span>
                              <span style={{marginLeft:12}}><strong>Updated:</strong> {new Date(issue.lastUpdatedAt).toLocaleString()}</span>
                              <button className="btn-edit" style={{marginLeft:'auto'}} onClick={()=>{setIssueEditing(issue._id);setIssueEditForm({issueTitle:issue.issueTitle,issueDescription:issue.issueDescription,issueType:issue.issueType,issueStatus:issue.issueStatus})}}>Edit</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              {/* Add Issue */}
              {addingIssue && (
                <div className="add-issue-modal">
                  <form className="add-issue-form" onSubmit={handleAddIssue}>
                    <h3>Add New Issue</h3>
                    <div className="form-row"><label>Title</label><input value={addIssueForm.issueTitle} onChange={e=>setAddIssueForm(f=>({...f,issueTitle:e.target.value}))} required /></div>
                    <div className="form-row"><label>Description</label><textarea value={addIssueForm.issueDescription} onChange={e=>setAddIssueForm(f=>({...f,issueDescription:e.target.value}))} rows={2} required /></div>
                    <div className="form-row"><label>Type</label>
                      <select value={addIssueForm.issueType} onChange={e=>setAddIssueForm(f=>({...f,issueType:e.target.value}))} required>
                        <option value="">Select type</option>
                        {issueTypeOptions.map(type=>(<option key={type} value={type}>{type}</option>))}
                      </select>
                    </div>
                    <div className="form-actions"><button className="btn btn-primary" type="submit">Create</button><button type="button" className="btn" onClick={()=>setAddingIssue(false)}>Cancel</button></div>
                  </form>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
