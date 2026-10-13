import { Calendar } from 'lucide-react';
import { formatDate, getInitials, priorityLabels } from '../../utils/helpers';

const TaskCard = ({ task, onClick }) => {
  return (
    <div className="task-card" onClick={() => onClick?.(task)}>
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        <span className={`priority-badge priority-${task.priority}`}>
          {priorityLabels[task.priority] || task.priority}
        </span>
        {task.dueDate && (
          <span className="task-date">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      {task.assignees?.length > 0 && (
        <div className="task-assignees">
          {task.assignees.slice(0, 3).map((a) => (
            <div key={a._id} className="assignee-avatar" title={a.name}>
              {getInitials(a.name)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="assignee-avatar">+{task.assignees.length - 3}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
