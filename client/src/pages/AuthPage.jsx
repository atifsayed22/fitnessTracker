import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const initialFormState = {
  name: '',
  email: '',
  password: '',
  targetCalories: 2000
};

export default function AuthPage({ mode, onAuth }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = isRegister
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            targetCalories: Number(form.targetCalories) || 2000
          }
        : {
            email: form.email,
            password: form.password
          };

      const response = await client.post(`/api/auth/${mode}`, payload);
      onAuth(response.data);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-shell">
        <div className="panel panel-pad">
          <span className="brand-mark">
            <span className="brand-dot" />
            Fat-loss tracker
          </span>
          <h1 className="title">Track meals, calories, and bodyweight without manual logging.</h1>
          <p className="subtitle">
            Add meals in plain language, let Nutritionix parse the nutrition data, and monitor daily progress from a single dashboard.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-chip">1</div>
              <div>
                <strong>Natural language logging</strong>
                <div className="muted">Example: 2 eggs and 2 roti.</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-chip">2</div>
              <div>
                <strong>Structured daily records</strong>
                <div className="muted">Meals, calories, protein, and weight stay normalized by date.</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-chip">3</div>
              <div>
                <strong>Progress graphs</strong>
                <div className="muted">See calorie intake and bodyweight trends over time.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel auth-card">
          <div className="auth-header">
            <div>
              <h2>{isRegister ? 'Create account' : 'Welcome back'}</h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                {isRegister ? 'Register to start tracking your cut.' : 'Log in to continue your current streak.'}
              </p>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="field-grid">
                <div className="field-row">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
                </div>
                <div className="field-row">
                  <label htmlFor="targetCalories">Target calories</label>
                  <input
                    id="targetCalories"
                    name="targetCalories"
                    type="number"
                    min="0"
                    value={form.targetCalories}
                    onChange={updateField}
                    required
                  />
                </div>
              </div>
            ) : null}

            <div className="field-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
            </div>

            <div className="field-row">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                placeholder="Enter password"
                required
              />
            </div>

            {message ? <div className={`message ${isError ? 'message-error' : 'message-success'}`}>{message}</div> : null}

            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
            </button>

            <div className="helper-row">
              <span>{isRegister ? 'Already have an account?' : 'New here?'}</span>
              <Link to={isRegister ? '/login' : '/register'} className="button button-secondary">
                {isRegister ? 'Go to login' : 'Create account'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}