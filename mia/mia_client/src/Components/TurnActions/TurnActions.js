import "./roller.css";
import React, { useState } from "react";
import { beats } from "../../utils.js";

const gameStates = {
  START_TURN: "start_turn", // -> roll
  ROLL_WAS_LOWER: "low_roll", // -> reroll or lie -> end turn
  ROLL_WAS_HIGHER: "high_roll", // -> submit or lie -> end turn
  END_TURN: "end_turn", // -> start turn
};

function Roller({ state, setRoll, socket, name, room }) {
  const [validState, setValid] = useState("Lie About Roll?");
  const [gameState, setGameState] = useState(gameStates.START_TURN);

  const roll = () => {
    var r1 = Math.floor(Math.random() * 6) + 1;
    var r2 = Math.floor(Math.random() * 6) + 1;

    var larger = Math.max(r1, r2);
    var smaller = Math.min(r1, r2);

    setRoll({ ...state, isShaking: true });

    setTimeout(() => {
      let score = larger * 10 + smaller;
      setRoll({
        ...state,
        localRoll: score,
        isShaking: false,
      });
      let newTurnState = beats(score, state.currScore)
        ? gameStates.ROLL_WAS_HIGHER
        : gameStates.ROLL_WAS_LOWER;

      setGameState(newTurnState);
    }, 1000);
  };

  const submitRoll = () => {
    socket.emit("roller", {
      name: name,
      score: state.localRoll,
      room: room,
    });
    setGameState(gameStates.START_TURN);
    setRoll({
      ...state,
      localRoll: null,
    });
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
    } else if (!beats(numEntry, state.currScore)) {
      setValid("Lie is too low!");
    } else {
      setValid("Lied!");
      socket.emit("liar", { name: name, room: room, value: numEntry });
      setGameState(gameStates.START_TURN);
      setRoll({
        ...state,
        localRoll: null,
      });
    }
    setTimeout(() => setValid("Lie About Roll?"), 1500);
  }

  return (
    <div className="main">
      {state.isPlaying ? (
        <>
          <div className="rollerDiv">
            {gameState === gameStates.START_TURN && (
              <button onClick={() => roll()}>Roll</button>
            )}
            {gameState === gameStates.ROLL_WAS_HIGHER && (
              <button onClick={() => submitRoll()}>Submit Roll</button>
            )}
            {gameState !== gameStates.START_TURN && (
              <form onSubmit={(event) => validInput(event, setValid)}>
                <input className="rollerForm" type="text" maxLength="2" />
              </form>
            )}
            {gameState === gameStates.START_TURN && state.currScore > 0 && (
              <button onClick={() => call()}>Call</button>
            )}
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
