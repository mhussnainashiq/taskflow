import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const Header = ({ title, tabs, activeTab, onTabChange, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        {title && <h1 className="header-title">{title}</h1>}
        {tabs && tabs.length > 0 && (
          <div className="header-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`header-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="icon-btn" title="Search">
          <Search size={18} />
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={18} />
        </button>
        <div className="user-avatar" title={user?.name}>
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;
