import './Dashboard.css';

interface DashboardProps {
  onNewBook: () => void;
}

export default function Dashboard({ onNewBook }: DashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Books</h1>
        <button className="btn-primary" onClick={onNewBook}>
          + New Book
        </button>
      </div>
      <div className="dashboard-content">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>No books yet</h2>
          <p>Create your first interactive book with Jupyter Book features</p>
          <button className="btn-primary" onClick={onNewBook}>
            Create Your First Book
          </button>
        </div>
      </div>
    </div>
  );
}
