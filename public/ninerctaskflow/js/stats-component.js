// Stats Card Component
function StatsCard({ number, label }) {
  return (
    <div className="stats-card">
      <div className="stats-number">{number}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}