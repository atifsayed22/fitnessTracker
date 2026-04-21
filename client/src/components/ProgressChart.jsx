import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function ProgressChart({ data }) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
          <XAxis dataKey="label" stroke="#8fa6c0" />
          <YAxis stroke="#8fa6c0" />
          <Tooltip
            contentStyle={{
              background: '#08111c',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: 14,
              color: '#e5eef8'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#60a5fa" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}