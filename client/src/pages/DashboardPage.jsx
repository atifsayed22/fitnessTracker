import { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import ProgressChart from '../components/ProgressChart';
import StatCard from '../components/StatCard';
import { formatChartDate, formatReadableDate, toDateInputValue } from '../utils/date';

export default function DashboardPage({ auth, onLogout }) {
  const today = toDateInputValue();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calories, setCalories] = useState('');
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function loadLogs() {
    try {
      setLoadingLogs(true);
      const response = await client.get('/api/logs');
      setLogs(response.data.logs || []);
    } catch (error) {
      if (error.response?.status === 401) {
        onLogout();
        return;
      }

      setIsError(true);
      setMessage(error.response?.data?.message || 'Unable to load logs');
    } finally {
      setLoadingLogs(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const selectedLog = useMemo(
    () => logs.find((log) => log.date === selectedDate),
    [logs, selectedDate]
  );

  const chartData = useMemo(
    () =>
      logs.slice(-30).map((log) => ({
        label: formatChartDate(log.date),
        calories: Number(log.calories) || 0,
        weight: log.weight ?? null
      })),
    [logs]
  );

  const tableLogs = useMemo(
    () => [...logs].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()),
    [logs]
  );

  async function handleLogSubmit(event) {
    event.preventDefault();
    setSubmittingLog(true);
    setMessage('');

    try {
      await client.post('/api/logs/add', {
        calories,
        weight,
        date: selectedDate
      });

      setMessage('Log saved successfully');
      setIsError(false);
      setCalories('');
      setWeight('');
      await loadLogs();
    } catch (error) {
      if (error.response?.status === 401) {
        onLogout();
        return;
      }

      setIsError(true);
      setMessage(error.response?.data?.message || 'Unable to save log');
    } finally {
      setSubmittingLog(false);
    }
  }

  const selectedCalories = Number(selectedLog?.calories) || 0;
  const selectedWeight = selectedLog?.weight ?? 'Not logged';
  const targetCalories = auth?.user?.targetCalories || 2000;

  return (
    <div className="app-shell">
      <div className="container dashboard-grid">
        <div className="dashboard-top">
          <div className="dashboard-headline">
            <span className="brand-mark" style={{ width: 'fit-content' }}>
              <span className="brand-dot" />
              Fat-loss tracker
            </span>
            <h1>Good to see you, {auth?.user?.name || 'Athlete'}</h1>
            <p className="muted" style={{ margin: 0 }}>
              Track meals for {formatReadableDate(selectedDate)} and stay near your target of {targetCalories} calories.
            </p>
          </div>

          <div className="nav-link-row">
            <button className="button button-secondary" type="button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard label="Logged calories" value={`${selectedCalories.toFixed(0)} kcal`} hint="Selected date total" />
          <StatCard label="Bodyweight" value={typeof selectedWeight === 'number' ? `${selectedWeight.toFixed(1)} kg` : selectedWeight} hint="Latest entry for the selected date" />
          <StatCard label="Target calories" value={`${targetCalories} kcal`} hint="Stored on your profile" />
          <StatCard label="Logs tracked" value={`${logs.length}`} hint="Total days logged" />
        </div>

        {message ? <div className={`message ${isError ? 'message-error' : 'message-success'}`}>{message}</div> : null}

        <div className="dashboard-main">
          <div>
            <div className="panel section">
              <div className="auth-header" style={{ marginBottom: 16 }}>
                <div>
                  <h2 className="section-title">Add daily log</h2>
                  <p className="muted" style={{ margin: '6px 0 0' }}>
                    Manually enter calories and weight for the selected day.
                  </p>
                </div>
              </div>

              <form className="form" onSubmit={handleLogSubmit}>
                <div className="split-grid">
                  <div className="field-row">
                    <label htmlFor="selectedDate">Date</label>
                    <input id="selectedDate" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
                  </div>
                  <div className="field-row">
                    <label htmlFor="calories">Calories</label>
                    <input
                      id="calories"
                      type="number"
                      min="0"
                      max="10000"
                      value={calories}
                      onChange={(event) => setCalories(event.target.value)}
                      placeholder="1800"
                      required
                    />
                  </div>
                </div>

                <div className="field-row">
                  <label htmlFor="weight">Weight</label>
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    max="300"
                    step="0.1"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="74.2"
                    required
                  />
                </div>

                <button className="button button-primary" type="submit" disabled={submittingLog}>
                  {submittingLog ? 'Saving...' : 'Save log'}
                </button>
              </form>
            </div>

            <div className="panel section">
              <div className="auth-header" style={{ marginBottom: 8 }}>
                <div>
                  <h2 className="section-title">Weight trend</h2>
                  <p className="muted" style={{ margin: '6px 0 0' }}>
                    Last 30 entries by date.
                  </p>
                </div>
              </div>

              {loadingLogs ? <p className="muted">Loading chart...</p> : <ProgressChart data={chartData} />}
            </div>
          </div>

          <div>
            <div className="panel section">
              <div className="auth-header" style={{ marginBottom: 14 }}>
                <div>
                  <h2 className="section-title">Daily log</h2>
                  <p className="muted" style={{ margin: '6px 0 0' }}>
                    {formatReadableDate(selectedDate)}
                  </p>
                </div>
              </div>

              {selectedLog ? (
                <div className="log-list">
                  <div className="log-card">
                    <strong>Summary</strong>
                    <div className="muted">Calories: {selectedCalories.toFixed(0)} kcal</div>
                    <div className="muted">Weight: {typeof selectedWeight === 'number' ? `${selectedWeight.toFixed(1)} kg` : selectedWeight}</div>
                  </div>
                </div>
              ) : (
                <p className="muted">No log yet for this date.</p>
              )}
            </div>

            <div className="panel section">
              <div className="auth-header" style={{ marginBottom: 14 }}>
                <div>
                  <h2 className="section-title">Daily summary table</h2>
                  <p className="muted" style={{ margin: '6px 0 0' }}>
                    Date-wise calories and weight logs.
                  </p>
                </div>
              </div>

              <div className="table-wrap">
                {tableLogs.length ? (
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Calories</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableLogs.map((log) => {
                        return (
                          <tr key={log._id}>
                            <td>{formatReadableDate(log.date)}</td>
                            <td>{Number(log.calories).toFixed(0)} kcal</td>
                            <td>{log.weight !== null && log.weight !== undefined ? `${Number(log.weight).toFixed(1)} kg` : 'Not logged'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="muted">No logs yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}