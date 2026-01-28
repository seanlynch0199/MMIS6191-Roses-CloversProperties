import { useState, FormEvent } from 'react';
import { Athlete, AthleteCreate } from '../types';

interface AthleteFormModalProps {
  athlete: Athlete | null;
  onSave: (data: AthleteCreate) => Promise<void>;
  onClose: () => void;
}

function AthleteFormModal({ athlete, onSave, onClose }: AthleteFormModalProps) {
  const [firstName, setFirstName] = useState(athlete?.firstName ?? '');
  const [lastName, setLastName] = useState(athlete?.lastName ?? '');
  const [grade, setGrade] = useState(athlete?.grade?.toString() ?? '');
  const [team, setTeam] = useState(athlete?.team ?? '');
  const [events, setEvents] = useState(athlete?.events?.join(', ') ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = athlete !== null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    const data: AthleteCreate = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    if (grade) {
      const gradeNum = parseInt(grade, 10);
      if (!isNaN(gradeNum)) {
        data.grade = gradeNum;
      }
    }

    if (team.trim()) {
      data.team = team.trim();
    }

    if (events.trim()) {
      data.events = events
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
    }

    try {
      await onSave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save athlete');
      setIsSaving(false);
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal athlete-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Athlete' : 'Add Athlete'}</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="grade">Grade</label>
              <input
                type="number"
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="1"
                max="12"
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="team">Team</label>
              <input
                type="text"
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="e.g., Varsity, JV"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="events">Events (comma separated)</label>
            <input
              type="text"
              id="events"
              value={events}
              onChange={(e) => setEvents(e.target.value)}
              placeholder="e.g., 5K, 3200m, 1600m"
              disabled={isSaving}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AthleteFormModal;
