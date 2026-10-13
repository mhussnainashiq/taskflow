import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';

const Tasks = () => {
  const { openSidebar } = useOutletContext();

  return (
    <>
      <Header title="All Tasks" onMenuClick={openSidebar} />
      <div className="page-content">
        <div className="empty-state">
          <p>View and manage all tasks across projects from the Kanban board.</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Use the Board or List view for full task management.
          </p>
        </div>
      </div>
    </>
  );
};

export default Tasks;
