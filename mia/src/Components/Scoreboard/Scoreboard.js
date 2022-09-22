import "./scoreboard.css";

function Scoreboard({ score, lastRoll }) {
  return (
    <div className="scorerDiv">
      <h2>Lives={score}</h2>
      <h2>Last Roll={lastRoll}</h2>
    </div>
  );
}

export default Scoreboard;
