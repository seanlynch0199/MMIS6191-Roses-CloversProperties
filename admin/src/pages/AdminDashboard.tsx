import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, clearToken } from '../auth';
import { Athlete, AthleteCreate } from '../types';
import AthleteFormModal from '../components/AthleteFormModal';

function AdminDashboard() {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAthletes = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authFetch('/api/athletes');
      if (!response.ok) {
        throw new Error('Failed to fetch athletes');
      }
      const data = await response.json();
      setAthletes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load athletes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  function handleLogout() {
    clearToken();
    navigate('/admin/login', { replace: true });
  }

  function handleAddClick() {
    setEditingAthlete(null);
    setIsModalOpen(true);
  }

  function handleEditClick(athlete: Athlete) {
    setEditingAthlete(athlete);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setEditingAthlete(null);
  }

  async function handleSaveAthlete(data: AthleteCreate) {
    if (editingAthlete) {
      // Update existing athlete
      const response = await authFetch(`/api/athletes/${editingAthlete.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update athlete');
      }

      const updated = await response.json();
      setAthletes((prev) =>
        prev.map((a) => (a.id === editingAthlete.id ? updated : a))
      );
    } else {
      // Create new athlete
      const response = await authFetch('/api/athletes', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create athlete');
      }

      const created = await response.json();
      setAthletes((prev) => [...prev, created]);
    }

    handleModalClose();
  }

  async function handleDeleteClick(id: string) {
    setDeleteConfirm(id);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      const response = await authFetch(`/api/athletes/${deleteConfirm}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete athlete');
      }

      setAthletes((prev) => prev.filter((a) => a.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete athlete');
    } finally {
      setIsDeleting(false);
    }
  }

  function cancelDelete() {
    setDeleteConfirm(null);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <div className="athletes-section">
          <div className="section-header">
            <h2>Athletes</h2>
            <button onClick={handleAddClick} className="btn btn-primary">
              Add Athlete
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading">Loading athletes...</div>
          ) : athletes.length === 0 ? (
            <div className="empty-state">
              <p>No athletes found. Click "Add Athlete" to create one.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="athletes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Team</th>
                    <th>Events</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((athlete) => (
                    <tr key={athlete.id}>
                      <td>
                        {athlete.firstName} {athlete.lastName}
                      </td>
                      <td>{athlete.grade ?? '-'}</td>
                      <td>{athlete.team ?? '-'}</td>
                      <td>{athlete.events?.join(', ') || '-'}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEditClick(athlete)}
                          className="btn btn-small btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(athlete.id)}
                          className="btn btn-small btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <AthleteFormModal
          athlete={editingAthlete}
          onSave={handleSaveAthlete}
          onClose={handleModalClose}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this athlete? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={cancelDelete}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
