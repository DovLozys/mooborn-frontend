import { useState, useEffect } from "react";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./SleepTracker.css";

function SleepTracker() {

  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);

  const { user, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(0);

  const [latestSleeps, setLatestSleeps] = useState([])
  const [sleepStart, setSleepStart] = useState(0);
  const [sleepEnd, setSleepEnd] = useState(0);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [endButtonDisabled, setEndButtonDisabled] = useState(true);
  const [fadeButton, setFadeButton] = useState(1);

  const [showSubmitButton, setSubmitButton] = useState(true);

  useEffect(() => {
    localStorage.setItem("startTime", JSON.stringify(sleepStart));
  }, [sleepStart]);

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestSleeps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getFamilyId() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/families/?family_name=${user.name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    checkFamilyIdMatch(data.payload[0].family_id);
  }

  async function checkFamilyIdMatch(familyId) {
    const token = await getAccessTokenSilently();
    const res_child = await fetch(`${API_URL}/children/${childId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const child = await res_child.json();

    if (child.payload.length < 1) {
      return;
    }
    if (familyId === child.payload[0].family_id) {
      setVisible(true);
      return;
    }
  }

  async function getUserId() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/users/email/${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUserId(data.payload[0].user_id);
  }

  async function getLatestSleeps() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/sleeps/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLatestSleeps(data.payload);
  }

  async function postSleepTimes() {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/sleeps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
        sleep_duration_ms: sleepDuration ,
        child_id: childId,
        user_id: userId,
      }),
    });

    const data = await response.json();
    getLatestSleeps();
    console.log("sleep data sent:", data.payload)
  }

  function displayLatestSleepTimes(sleep) {
    const display_date = new Date(
      sleep.sleep_start
    ).toLocaleString();
    const key_prop = sleep.sleep_id;
    const current_sleepDuration = sleep.sleep_duration_ms;

    return (
      <p key={key_prop}>
        {display_date} - {msToTime(current_sleepDuration)}
      </p>
    );
  }

  function msToTime(duration) {
    // let milliseconds = Math.ceil((duration % 1000) / 100);
    // let seconds = Math.ceil((duration / 1000) % 60);
    let minutes = Math.round((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes;
  }

  function handleStartTime() {
    setSleepStart(new Date());
    
    //make the button disabled once it's been clicked and to enable to stop button
    //change the disabled prop of the start button to true
    //change the disabled prop of the stop button to false
    setStartButtonDisabled(true);
    setEndButtonDisabled(false);
    setSleepEnd("");
    setFadeButton(0.5);
  }

  function handleStopTime() {
    const stopTime = new Date();

    setSleepEnd(stopTime);
    setSleepDuration(stopTime - sleepStart);
    setStartButtonDisabled(false);
    setEndButtonDisabled(true);
    setSubmitButton(false);
  }

  const submitTime = () => {
    postSleepTimes();

  };

  if (!visible) {
    return <div></div>;
  }

  return (
    <main>
      <Navbar />
      <div className="sleeptracker-content">
          <Avatar name="" idName="sleepTracker-avatar"/>
        <div className="tracker-content">
          <h3 className="sleepTime">Sleep time: {msToTime(sleepDuration)}</h3>
          <div className="sleeptracker-buttons">
            <div className="startButton">
              <Button
                style={{ opacity: fadeButton }}
                btnStyle="start"
                onclick={handleStartTime}
                disabled={startButtonDisabled}
                text="START"
              />
              <p>Sleep start: {msToTime(sleepStart)}</p>
            </div>
            <div className="stopButton">
              <Button
                btnStyle="stop"
                text="STOP"
                onclick={handleStopTime}
                disabled={endButtonDisabled}
              />
              <p>Sleep end: {msToTime(sleepEnd)}</p>
            </div>
          </div>
          <div className="submit-button">
            {showSubmitButton ? (
              ""
            ) : (
              <Button
                btnStyle="submitButton-sleeps"
                text="Submit"
                onclick={submitTime}
              />
            )}
          </div>
          <div className="sleep-latest">
            <h2>Latest sleeps:</h2>
            {latestSleeps.map(displayLatestSleepTimes)}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuthenticationRequired(SleepTracker, {
  onRedirecting: () => <Loading />,
});
