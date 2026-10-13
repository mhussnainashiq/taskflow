import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Users, TrendingUp } from 'lucide-react';
import Header from '../components/layout/Header';
import { localProjects } from '../services/localStore';
import { formatRelativeTime, getInitials } from '../utils/helpers';

const Dashboard = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localProjects.getAll();
    setProjects(data);
    if (data.length > 0) {
      setStats(localProjects.getStats(data[0]._id));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Dashboard" onMenuClick={openSidebar} />
        <div className="page-content">
          <div className="loading-spinner"><div className="spinner" /></div>
        </div>
      </>
    );
  }

  const totalTasks = stats?.totalTasks || 0;
  const progress = stats?.progress || 0;

  return (
    <>
      <Header title="Dashboard" onMenuClick={openSidebar} />
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-label"><FolderKanban size={16} style={{ display: 'inline', marginRight: 6 }} />Projects</div>
            <div className="stat-value">{projects.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label"><CheckSquare size={16} style={{ display: 'inline', marginRight: 6 }} />Total Tasks</div>
            <div className="stat-value">{totalTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label"><Users size={16} style={{ display: 'inline', marginRight: 6 }} />Team Members</div>
            <div className="stat-value">{stats?.memberCount || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label"><TrendingUp size={16} style={{ display: 'inline', marginRight: 6 }} />Progress</div>
            <div className="stat-value">{progress}%</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Your Projects</h3>
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Create one to get started.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/projects')}>
                  Create Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {projects.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/board?project=${p._id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color || '#3B82F6' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.members?.length || 0} members</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stat-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
            {!stats?.recentActivity?.length ? (
              <div className="empty-state"><p>No recent activity</p></div>
            ) : (
              <div className="activity-list">
                {stats.recentActivity.map((a) => (
                  <div key={a._id} className="activity-item">
                    <div className="activity-avatar">{getInitials(a.user?.name)}</div>
                    <div className="activity-content">
                      <div className="activity-text"><strong>{a.user?.name}</strong> {a.message}</div>
                      <div className="activity-time">{formatRelativeTime(a.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;