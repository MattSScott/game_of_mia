import dice_cup from "./Assets/dice_cup.png";
import "./App.css";
import Scoreboard from "./Components/Scoreboard/Scoreboard.js";
import Roller from "./Components/TurnActions/TurnActions.js";
import React, { useEffect, useState } from "react";
import { socket } from "./Services/socket.js";

const loginStates = {
  LOGIN: "login",
  WAITING: "waiting",
  JOINING: "joining",
  PLAYING: "playing",
};

const gameStates = {
  START_TURN: "start_turn",
  ROLL_WAS_LOWER: "low_roll",
  ROLL_WAS_HIGHER: "high_roll",
  END_TURN: "end_turn",
};

function App() {
  const [userState, setUserState] = useState({
    currentUsername: null,
    currentUserID: 1,
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

        setUserState((u) => ({
          ...u,
          currentUsername: userData.username,
          currentUserID: userData.userID,
        }));
      });
      //Send Socket command to create user info for current user
      // socket.emit("CreateUserData");
      socket.emit("init");
    } else {
      //If user already has userid and username, notify server to allow them to join chat
      socket.emit("initExisting", usernameVal);

      setUserState((u) => ({
        ...u,
        currentUsername: usernameVal,
        currentUserID: userIDVal,
      }));
    }
  }, []);

  const [state, setState] = useState({
    lives: 6,
    lastLife: false,
    lastRoll: 0,
    isShaking: false,
    isPlaying: false,
  });

  const [login, setLogin] = useState({
    state: loginStates.LOGIN,
    loginCode: null,
    isHost: false,
    playingWith: [],
  });

  socket.on("startTurn", () => {
    setState({ ...state, isPlaying: true });
  });

  socket.on("endTurn", () => {
    setState({ ...state, isPlaying: false });
  });

  socket.on("roomJoined", (msg) => {
    setLogin((l) => ({
      ...l,
      state: loginStates.WAITING,
      isHost: msg.host,
      loginCode: login.loginCode ? login.loginCode : msg.room,
    }));
  });

  socket.on("gameStarted", () => {
    setLogin({ ...login, state: loginStates.PLAYING });
  });

  socket.on("updateRoomies", (mates) => {
    setLogin({ ...login, playingWith: mates });
  });

  socket.on("newScore", (score) => {
    setState({ ...state, lastRoll: score });
  });

  const joinRoom = (e) => {
    e.preventDefault();
    let formData = e.target[0].value;
    // socket.emit('createRoom', formData)
    socket.emit(
      "joinRoom",
      {
        roomName: formData,
        userName: userState.currentUsername,
      },
      (resp) => {
        if (resp) {
          setLogin((l) => ({
            ...l,
            state: loginStates.JOINING,
            loginCode: formData,
          }));
        } else {
          alert("Room is Full!");
        }
      }
    );
  };

  if (login.state === loginStates.LOGIN) {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Please Join or Create a Room</h2>
          <form onSubmit={(e) => joinRoom(e)}>
            <input type="text" />
            <div>
              <input type="submit" value="Join Room" />
            </div>
          </form>
          <button>Create Room</button>
        </header>
      </div>
    );
  }

  if (login.state === loginStates.JOINING) {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Joining Room...</h2>
        </header>
      </div>
    );
  }

  if (login.state === loginStates.WAITING) {
    let button = (
      <button
        onClick={() => {
          socket.emit("startGame", login.loginCode);
        }}
      >
        Press to Start
      </button>
    );

    return (
      <div className="App">
        <header className="App-header">
          <h2>Room ID: {login.loginCode}</h2>
          <h3>Playing With:</h3>
          <ul>
            {login.playingWith.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <h2>
            {login.isHost ? "You are the Host" : "Waiting for Host to Start"}
          </h2>
          {login.isHost && button}
        </header>
      </div>
    );
  }

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
        <Roller
          state={state}
          setRoll={setState}
          socket={socket}
          name={userState.currentUsername}
          room={login.loginCode}
        />
        <h2>Active: {state.isPlaying ? "Yes" : "No"}</h2>
        <h2>Playing as: {userState.currentUsername}</h2>
        <h2>In Room: {login.loginCode}</h2>
      </header>
    </div>
  );
}

export default App;
