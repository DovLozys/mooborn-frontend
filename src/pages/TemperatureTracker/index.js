import React, { useState, useEffect } from "react";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

import "./TemperatureTracker.css";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

// the formula to convert from Celsius to Fahrenheit is ( C * 1.8 ) + 32 = F, ie. 37C = 98.6F
// to convert from Fahrenheit to Celsius, the formula is ( F - 32 ) / 1.8 = C

function TemperatureTracker() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);

  const { user, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(0);
  const [latestTemperatures, setLatestTemperatures] = useState([]);

  const [temperatureValueC, setTemperatureValueC] = useState(37);
  const [temperatureValueF, setTemperatureValueF] = useState(
    (temperatureValueC * 18 + 320) / 10
  );
  const [temperatureColor, setTemperatureColorC] = useState("cold");
  const [temperatureColorF, setTemperatureColorF] = useState("cold");

  const [buttonDisabledC, setButtonDisabledC] = useState(true);
  const [buttonDisabledF, setButtonDisabledF] = useState(false);

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestTemperatures();
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

  async function getLatestTemperatures() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/temperatures/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLatestTemperatures(data.payload);
  }

  async function postTemperature(recordedTemp) {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/temperatures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        temperature_date: new Date(),
        temperature: recordedTemp,
        child_id: childId,
        user_id: userId,
      }),
    });

    const status = response.status;
    getLatestTemperatures();
    return status;
  }

  function increaseTemperature() {
    if (buttonDisabledC) {
      if (temperatureValueC === 41) return;
    }
    if (temperatureValueF === 105) return;

    if (buttonDisabledC) {
      const temp = temperatureValueC * 10;
      const newTemperature = (temp + 0.1 * 10) / 10;

      setTemperatureValueC(newTemperature);

      setTemperatureValueF(
        (
          (((temperatureValueC * 10 + 0.1 * 10) / 10) * 180 + 3200) /
          100
        ).toFixed(1)
      );

      if (newTemperature > 37.5) {
        setTemperatureColorC("hot");
        setTemperatureColorF("hot");
      }
    }

    if (buttonDisabledF) {
      const tempF = temperatureValueF * 10;
      const newTemperatureF = (tempF + 0.1 * 10) / 10;

      setTemperatureValueF(newTemperatureF);

      setTemperatureValueC(
        ((temperatureValueF * 10 + 0.1 * 10 - 320) / 18).toFixed(1)
      );

      if (newTemperatureF > 99.6) {
        setTemperatureColorC("hot");
        setTemperatureColorF("hot");
      }
    }
  }

  function decreaseTemperature() {
    if (buttonDisabledC) {
      if (temperatureValueC === 34) return;
    }
    if (temperatureValueF === 93) return;

    if (buttonDisabledC) {
      const tempNeg = temperatureValueC * 10;
      const newTemperature = (tempNeg - 0.1 * 10) / 10;

      setTemperatureValueC(newTemperature);

      setTemperatureValueF(
        (
          (((temperatureValueC * 10 - 0.1 * 10) / 10) * 180 + 3200) /
          100
        ).toFixed(1)
      );

      if (newTemperature <= 37.5) {
        setTemperatureColorC("cold");
        setTemperatureColorF("cold");
      }
    }

    if (buttonDisabledF) {
      const tempNegF = temperatureValueF * 10;
      const newTemperatureF = (tempNegF - 0.1 * 10) / 10;

      setTemperatureValueF(newTemperatureF);

      setTemperatureValueC(
        ((temperatureValueF * 10 - 0.1 * 10 - 320) / 18).toFixed(1)
      );

      if (newTemperatureF <= 99.6) {
        setTemperatureColorC("cold");
        setTemperatureColorF("cold");
      }
    }
  }

  function handleClickForC() {
    setButtonDisabledC(true);
    setButtonDisabledF(false);
    setShowResults(false);
  }

  function handleClickForF() {
    setButtonDisabledC(false);
    setButtonDisabledF(true);
    setShowResults(true);
  }

  function postTemperatureC() {
    postTemperature(temperatureValueC);
  }

  function postTemperatureF() {
    postTemperature(temperatureValueF);
  }

  function displayLatestTemperature(temperature) {
    const display_date = new Date(
      temperature.temperature_date
    ).toLocaleString();
    const key_prop = temperature.temperature_id;
    const current_temp = temperature.temperature;

    if (current_temp > 41) {
      return (
        <p key={key_prop}>
          {display_date} - {current_temp}°F
        </p>
      );
    }
    return (
      <p key={key_prop}>
        {display_date} - {current_temp}°C
      </p>
    );
  }

  if (!visible) {
    return <div></div>;
  }

  return (
    <main>
      <Navbar />
      <div className="temperatureTracker">
        <Avatar idName="temperatureTracker-avatar" />
        <div className="buttonsAndThermometer">
          <div className="optionButtons">
            <Button
              btnStyle="ordinarybutton"
              text={`°C`}
              onclick={handleClickForC}
              disabled={buttonDisabledC}
            />
            <Button
              btnStyle="ordinarybutton"
              text={`°F`}
              onclick={handleClickForF}
              disabled={buttonDisabledF}
            />
          </div>
          <div className="temperaturetracker-content">
            <div className="app-container">
              <div className="temperature-display-container">
                {showResults ? (
                  <div>
                    <Button
                      btnStyle={`temperature-display ${temperatureColorF}`}
                      text={temperatureValueF + `°F`}
                      onclick={postTemperatureF}
                    />
                  </div>
                ) : (
                  <div>
                    <Button
                      btnStyle={`temperature-display ${temperatureColor}`}
                      text={temperatureValueC + `°C`}
                      onclick={postTemperatureC}
                    />
                  </div>
                )}
              </div>
              <div className="button-container">
                <Button
                  btnStyle="bttn"
                  text="-"
                  onclick={decreaseTemperature}
                />
                <Button
                  btnStyle="bttn"
                  text="+"
                  onclick={increaseTemperature}
                />
              </div>
            </div>
          </div>
          <div className="temperature-latest">
            <h2>Latest temperatures:</h2>
            {latestTemperatures.map(displayLatestTemperature)}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuthenticationRequired(TemperatureTracker, {
  onRedirecting: () => <Loading />,
});
