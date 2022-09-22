import "./roller.css";
import React, { useState } from "react";
import { wait } from "@testing-library/user-event/dist/utils";


function Roller({ state, setRoll }) {
  const [validState, setValid] = useState("Lie About Roll");

  async function roll() {
    var r1 = Math.floor(Math.random() * 6) + 1;
    var r2 = Math.floor(Math.random() * 6) + 1;

    var larger = Math.max(r1, r2);
    var smaller = Math.min(r1, r2);

    setRoll({ ...state, isShaking: true });

    await wait(1000);

    setRoll({ ...state, lastRoll: larger * 10 + smaller, isShaking: false });
  }

  const decLives = () => {
    var newLives = state.lives - 1;
    if (newLives == 0) {
      setRoll({ ...state, lastLife: true, lives: 6 });
    } else {
      setRoll({ ...state, lives: state.lives - 1 });
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
      setRoll({...state, lastRoll: entry})
    }
  }

  return (
    <div className="main">
      <div className="rollerDiv">
        <button onClick={() => roll()}>Roll</button>
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
