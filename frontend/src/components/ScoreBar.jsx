export function ScoreBar({ label, score }) {
  return (
    <div className="score-row">
      <span>{label}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${score * 10}%` }} />
      </div>
      <strong>{score}</strong>
    </div>
  );
}
