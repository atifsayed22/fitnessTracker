export default function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="muted" style={{ margin: '10px 0 0' }}>{hint}</p> : null}
    </div>
  );
}