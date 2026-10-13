import { useOutletContext } from 'react-router-dom';
import Header from '../components/layout/Header';

const Reports = () => {
  const { openSidebar } = useOutletContext();

  return (
    <>
      <Header title="Reports" onMenuClick={openSidebar} />
      <div className="page-content">
        <div className="empty-state">
          <p>Detailed reports and analytics coming soon.</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Check the Team Dashboard for current progress and task distribution.
          </p>
        </div>
      </div>
    </>
  );
};

export default Reports;
