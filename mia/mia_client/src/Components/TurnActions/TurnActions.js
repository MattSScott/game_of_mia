import "./roller.css";
import React, { useState } from "react";
import { beats } from "../../utils.js";

function Roller({ state, setRoll, socket, name, room }) {
  const [validState, setValid] = useState("Lie About Roll?");

  const roll = () => {
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
      socket.emit("roller", {
        name: name,
        score: larger * 10 + smaller,
        room: room,
      });
    }, 1000);
  };

  const call = () => {
    socket.emit("caller", { name: name, room: room });
  };

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

  socket.on("lifeLost", () => {
    decLives();
  });

  function validInput(event) {
    event.preventDefault();
    var entry = event.target[0].value;
    var numEntry = parseInt(entry);
    var d1 = entry[0];
    var d2 = entry[1];
    if (
      !Number.isInteger(numEntry) ||
      d2 > d1 ||
      d2 > 6 ||
      d1 > 6 ||
      d2 < 1 ||
      d1 < 1
    ) {
      setValid("Invalid Input");
    } else if (!beats(numEntry, state.lastRoll)) {
      setValid("Lie is too low!");
    } else {
      setValid("Lied!");
      socket.emit("liar", { name: name, room: room, value: numEntry });
    }
    setTimeout(() => setValid("Lie About Roll?"), 1500);
  }

  return (
    <div className="main">
      {state.isPlaying ? (
        <>
          <div className="rollerDiv">
            <button onClick={() => roll()}>Roll</button>
            <form onSubmit={(event) => validInput(event, setValid)}>
              <input className="rollerForm" type="text" maxLength="2" />
            </form>
            <button onClick={() => call()}>Call</button>
            {/* <button onClick={() => decLives()}>Dec Lives</button> */}
          </div>

          <p>{validState}</p>
        </>
      ) : (
        <h2>Waiting for Turn...</h2>
      )}
    </div>
  );
}

export default Roller;
