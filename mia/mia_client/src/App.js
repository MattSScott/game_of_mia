import dice_cup from "./Assets/dice_cup.png";
import "./App.css";
import Scoreboard from "./Components/Scoreboard/Scoreboard.js";
import Roller from "./Components/TurnActions/TurnActions.js";
import React, { useEffect, useState } from "react";
import { socket } from "./Services/socket.js";

function App() {
  const [userState, setUserState] = useState({
    currentUsername: "User1",
    currentUserID: 1,
    initialLoad: true,
  });

  useEffect(() => {
    let userIDVal = localStorage.getItem("userID");
    let usernameVal = localStorage.getItem("username");

    if (!userIDVal) {
      socket.on("SetUserData", (userData) => {
        //When user creation on server is complete, retrieve and save data to local storage
        localStorage.setItem("userID", userData.userID);
        localStorage.setItem("username", userData.username);
        console.log(userData);

        setUserState({
          currentUsername: userData.username,
          currentUserID: userData.userID,
        });

        //Notify Socket server is not ready to chat
        // socket.emit("UserEnteredRoom", userData);
      });
      socket.emit("test", "Hello Mia");
      //Send Socket command to create user info for current user
      // socket.emit("CreateUserData");
    } else {
      //If user already has userid and username, notify server to allow them to join chat
      setUserState({ currentUsername: usernameVal, currentUserID: userIDVal });
      // socket.emit("UserEnteredRoom", {
      //   userID: userIDVal,
      //   username: usernameVal,
      // });
    }
  }, []);

  const [state, setState] = useState({
    lives: 6,
    lastLife: false,
    lastRoll: 0,
    isShaking: false,
  });

  useEffect(() => {
    socket.emit("roller", `player ${userState.currentUsername} rolled ${state.lastRoll}`)
  }, [state.lastRoll])

  // constructor = define object above and dynamically make array: [0] player:true [1->n-1] player:false

  return (
    <div className="App">
      <header
        className={state.lastLife ? "App-header-last-life" : "App-header"}
      >
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
