import dice_cup from "./Assets/dice_cup.png";
import "./App.css";
import Scoreboard from "./Components/Scoreboard/Scoreboard.js";
import Roller from "./Components/TurnActions/TurnActions.js";
import React, { useState } from "react";

function App() {
  const [state, setState] = useState({
    lives: 6,
    lastLife: false,
    lastRoll: 0,
    isShaking: false,
  });

  return (
    <div className="App">
      <header className={state.lastLife ? "App-header-last-life" : "App-header"}>
        <h1>The Game of Mia</h1>
        <Scoreboard score={state.lives} lastRoll={state.lastRoll} />
        <img
          src={dice_cup}
          className={state.isShaking ? "App-logo-shake" : "App-logo"}
          alt="cup"
        />
        <Roller state={state} setRoll={setState} />
      </header>
    </div>
  );
}

export default App;
