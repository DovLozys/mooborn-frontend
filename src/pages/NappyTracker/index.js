import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";

import "./NappyTracker.css";

function NappyTracker() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);

  const { user, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(0);

  const [latestNappyChange, setLatestNappyChange] = useState([]);
  const [color, setColor] = useState("");
  const [showResultsLeft, setShowResultsLeft] = useState(true);
  const [showResultsRight, setShowResultsRight] = useState(true);
  const [optionalDetailsForPee, setOptionalDetailsForPee] = useState(true);
  const [optionalDetailsForPop, setOptionalDetailsForPoop] = useState(true);
  const [optionalDetailsValue, setOptionalDetailsValue] = useState("");
  const [optionalDetailsValuePoop, setOptionalDetailsValuePoop] = useState("");

  const [showColors, setShowColors] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestNappyChanges();
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

  async function getLatestNappyChanges() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/nappies/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLatestNappyChange(data.payload);
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

  function handleOnChange(event) {
    setColor(event.target.value);
    console.log("color", color);
    console.log("Pee", optionalDetailsValue);
    console.log("Poop", optionalDetailsValuePoop);
  }

  function handleChangeOptions(event) {
    setOptionalDetailsValue(event.target.value);
    console.log("Pee", optionalDetailsValue);
    console.log("Poop", optionalDetailsValuePoop);
  }

  function handleChangeOptionsPoop(event) {
    setOptionalDetailsValuePoop(event.target.value);
    console.log("Poop", optionalDetailsValuePoop);
    console.log("Pee", optionalDetailsValue);
  }

  function handleOpenForLeft() {
    setShowResultsLeft(false);
    setOptionalDetailsForPee(false);
    setShowSubmitButton(false);
  }

  function handleCloseForLeft() {
    setShowResultsLeft(true);
    setOptionalDetailsForPee(true);
    if (showResultsRight) {
      setShowSubmitButton(true);
    }
  }

  function handleOpenForRight() {
    setShowResultsRight(false);
    setShowColors(false);
    setOptionalDetailsForPoop(false);
    setShowSubmitButton(false);
  }

  function handleCloseForRight() {
    setShowResultsRight(true);
    setShowColors(true);
    setOptionalDetailsForPoop(true);
    if (showResultsLeft) {
      setShowSubmitButton(true);
    }
  }

  async function postNappyChange() {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/nappies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nappy_date: new Date(),
        nappy_type: nappyType(),
        nappy_quantity: nappyQuantity(),
        child_id: childId,
        user_id: userId,
      }),
    });

    const data = await response.json();
    getLatestNappyChanges();
    console.log(data);
  }

  function nappyType() {
    if (optionalDetailsForPee === false && optionalDetailsForPop === false) {
      return "Both";
    } else {
      return optionalDetailsForPee ? "Poop" : "Pee";
    }
  }

  function nappyQuantity() {
    if (optionalDetailsForPee === false && optionalDetailsForPop === false) {
      return `${optionalDetailsValue}, ${optionalDetailsValuePoop}`;
    } else {
      return optionalDetailsForPee
        ? optionalDetailsValuePoop
        : optionalDetailsValue;
    }
  }

  function displayLatestNappyChange(nappyChange) {
    const display_date = new Date(nappyChange.nappy_date).toLocaleString();
    const key_prop = nappyChange.nappy_id;
    const current_nappyContent = nappyChange.nappy_type;
    const current_nappyQuantity = nappyChange.nappy_quantity;

    return (
      <p key={key_prop}>
        {display_date} - {current_nappyContent}, {current_nappyQuantity}
      </p>
    );
  }

  function submitNappies() {
    postNappyChange();
  }

  if (!visible) {
    return <div></div>;
  }

  return (
    <main>
      <Navbar />
      <div className="nappy-content">
        <Avatar idName="nappyContent-avatar" />
        <div className="nappyContent-tracking">
          <div className="nappy-tracker-buttons">
            <div className="leftButton">
              {showResultsLeft ? (
                <Button
                  btnStyle="left-button"
                  onclick={handleOpenForLeft}
                  text="💦"
                />
              ) : (
                <div className="left-scale">
                  <Button
                    btnStyle="left-button"
                    onclick={handleCloseForLeft}
                    text="💦"
                  />
                </div>
              )}
              <div className="optional-details">
                {optionalDetailsForPee ? (
                  ""
                ) : (
                  <div>
                    <div className="pee">💦</div>
                    <input
                      type="radio"
                      value="Small"
                      name="amount"
                      onChange={handleChangeOptions}
                    />{" "}
                    Small &nbsp;
                    <input
                      type="radio"
                      value="Medium"
                      name="amount"
                      onChange={handleChangeOptions}
                    />{" "}
                    Medium &nbsp;
                    <input
                      type="radio"
                      value="Large"
                      name="amount"
                      onChange={handleChangeOptions}
                    />{" "}
                    Large
                  </div>
                )}
              </div>
            </div>
            <div className="rightButton">
              {showResultsRight ? (
                <Button
                  btnStyle="right-button"
                  onclick={handleOpenForRight}
                  text="💩"
                />
              ) : (
                <div className="right-scale">
                  <Button
                    btnStyle="right-button"
                    onclick={handleCloseForRight}
                    text="💩"
                  />
                </div>
              )}
              <div className="poopDetails">
                <div className="show-colors">
                  {showColors ? (
                    ""
                  ) : (
                    <div className="radioButtons">
                      <div className="color-list">
                        <input
                          type="radio"
                          value="yellow"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        🟡 &nbsp;
                        <input
                          type="radio"
                          value="brown"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        🟤 &nbsp;
                        <input
                          type="radio"
                          value="black"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        ⚫️&nbsp;
                        <input
                          type="radio"
                          value="green"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        🟢&nbsp;
                        <input
                          type="radio"
                          value="red"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        🔴&nbsp;
                        <input
                          type="radio"
                          value="white"
                          name="colors"
                          onChange={handleOnChange}
                        />{" "}
                        ⚪️&nbsp;
                      </div>
                    </div>
                  )}
                </div>
                <div className="optional-details-poop">
                  {optionalDetailsForPop ? (
                    ""
                  ) : (
                    <div>
                      <div className="poo">💩</div>
                      <input
                        type="radio"
                        value="Small"
                        name="amount-poo"
                        onChange={handleChangeOptionsPoop}
                      />{" "}
                      Small &nbsp;
                      <input
                        type="radio"
                        value="Medium"
                        name="amount-poo"
                        onChange={handleChangeOptionsPoop}
                      />{" "}
                      Medium &nbsp;
                      <input
                        type="radio"
                        value="Large"
                        name="amount-poo"
                        onChange={handleChangeOptionsPoop}
                      />{" "}
                      Large
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="submit-button">
            {showSubmitButton ? (
              ""
            ) : (
              <Button
                btnStyle="submitButton-nappies"
                text="Submit"
                onclick={submitNappies}
              />
            )}
          </div>
          <div className="nappies-latest">
            <h2 className="latestNappyChanges">Latest nappy changes:</h2>
            {latestNappyChange.map(displayLatestNappyChange)}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuthenticationRequired(NappyTracker, {
  onRedirecting: () => <Loading />,
});
