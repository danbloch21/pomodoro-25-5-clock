import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(
    new Audio("http://www.loyalhannadockyard.com/PLAY%20JJC-M107-1.wav")
  );

  {
    /** audio file to alert when session and break times reach zero */
  }
  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  {
    /**  */
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  {
    /** sets display format for the time */
  }

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }

      {
        /** prevents input value for break length from going below 1. Amount is the value for the session or break length chosen by the user */
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      {
        /** prevents input value for session length from going below 1 */
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };
  const controlTime = () => {
    let second = 1000;
    {
      /** one second = 1,000 milliseconds */
    }
    let date = new Date().getTime();
    {
      /** stores current date in seconds in the variable date */
    }
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
              {
                /** when session time reaches zero and the timer is not on break, play the break sound from audio file above and switch display to break time. When break time reaches zero play break time again and switch back to session time */
              }
            }

            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);

      {
        /** controlTime function checks every 30 milliseconds if the current date is greater than the value of nextDate and if so, reduces the timer value by one */
      }
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    {
      /** pauses the counter by passing the interval into local storage and clearing it if the timer is on */
    }

    setTimerOn(!timerOn);
  };
  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  {
    /** resetTime function just sets all three times displayed to the default values */
  }
  return (
    <div className="center-align">
      <h1>Pomodoro Clock</h1>
      <h4>Coded By Dan Bloch</h4>
      <div className="dual-container">
        <Length
          title={"Break Length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"Session Length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
        {/** Break Length and Session Length components take in breakTime and sessionTime variables defined in lines 7 and 8 */}
      </div>
      <h3>{onBreak ? "Break" : "Session"}</h3>
      {/** displays "Break" if onBreak is true and "Session" otherwise */}
      <h1>{formatTime(displayTime)}</h1>
      {/** displays session time defined by function in line 20  */}
      <button className="btn-large deep-purple lighten-2" onClick={controlTime}>
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      {/** button icon changes from play to pause if timer is on and vice versa, activated by controlTime function via onClick handler in line 122 */}
      <button className="btn-large deep-purple lighten-2" onClick={resetTime}>
        <i className="material-icons">autorenew</i>
        {/** reset button has class of autorenew and sets times back to default when activated by onClick handler calling resetTime function */}
      </button>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="time-sets">
        {/** sets custom CSS class */}
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(+60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
        {/** buttons styled using Materialize plus Materialize icon (see materializecss.com), with onClick handler to call changeTime function to adjust time up or down and type parameters corresponding to type parameters in lines 99 and 106 */}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
