import "./scoreboard.css";

function Scoreboard({ score, currScore, active, localRoll }) {
  return (
    <div className="scorerDiv">
      <h2>Lives={score}</h2>
      <h2>Score to Beat: {currScore}</h2>
      {active && <h2>You Rolled: {localRoll}</h2>}
    </div>
  );
}

export default Scoreboard;
