import "./roller.css";
import React, { useState } from "react";

function Roller({ state, setRoll, socket, name }) {
  const [validState, setValid] = useState("Lie About Roll");

  function roll() {
    var r1 = Math.floor(Math.random() * 6) + 1;
    var r2 = Math.floor(Math.random() * 6) + 1;

    var larger = Math.max(r1, r2);
    var smaller = Math.min(r1, r2);

    setRoll({ ...state, isShaking: true });

    setTimeout(() => {
      setRoll({
        ...state,
        lastRoll: larger * 10 + smaller,
        isShaking: false,
      });
      socket.emit("roller", { name: name, score: larger * 10 + smaller });
    }, 1000);
  }

  const decLives = () => {
    if (state.lives === "OUT") return;
    var newLives = state.lives - 1;
    if (newLives === 0 && state.lastLife) {
      setRoll({ ...state, lives: "OUT" });
    } else if (newLives === 0) {
      setRoll({ ...state, lastLife: true, lives: 6 });
    } else {
      setRoll({ ...state, lives: newLives });
    }
  };

  function validInput(event) {
    event.preventDefault();
    var entry = event.target[0].value;
    var d1 = entry[0];
    var d2 = entry[1];
    if (
      !Number.isInteger(parseInt(entry)) ||
      d2 > d1 ||
      d2 > 6 ||
      d1 > 6 ||
      d2 < 1 ||
      d1 < 1
    ) {
      setValid("Invalid Format");
    } else {
      setValid("Valid");
      setRoll({ ...state, lastRoll: entry });
      setTimeout(() => setValid("Lie About Roll"), 500);
    }
  }

  return (
    <div className="main">
      <div className="rollerDiv">
        <button onClick={() => state.isPlaying && roll()}>Roll</button>
        <form onSubmit={(event) => validInput(event, setValid)}>
          <input className="rollerForm" type="text" maxLength="2" />
        </form>
        <button onClick={() => decLives()}>Dec Lives</button>
      </div>
      <p>{validState}</p>
    </div>
  );
}

export default Roller;
