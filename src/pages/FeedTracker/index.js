import { useState, useEffect } from "react";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./FeedTracker.css";

function FeedTracker() {
  const params = useParams();
  const childId = parseInt(params.childId);
  const { user, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(0);
  const [visible, setVisible] = useState(false);

  const [feedStartRight, setFeedStartRight] = useState(0);
  const [feedStopRight, setFeedStopRight] = useState(0);

  const [feedStartLeft, setFeedStartLeft] = useState(0);
  const [feedStopLeft, setFeedStopLeft] = useState(0);

  const [feedDurationRight, setfeedDurationRight] = useState(0);
  const [feedDurationLeft, setfeedDurationLeft] = useState(0);

  const [totalFeedDurationLeft, setTotalFeedDurationLeft] = useState(0);
  const [totalFeedDurationRight, setTotalFeedDurationRight] = useState(0);

  const [totalLeft, setTotatlLeft] = useState(0);
  const [totalRight, setTotalRight] = useState(0);
  const [totalLeftRight, setTotatlLeftRight] = useState(0);

  const [showResultsRight, setShowResultsRight] = useState(true);
  const [showResultsLeft, setShowResultsLeft] = useState(true);

  const [showSubmitButton, setSubmitButton] = useState(true);
  const [showSubmitButtonBottle, setSubmitButtonBottle] = useState(true);

  const [buttonDisabledNursing, setButtonDisabledNursing] = useState(true);
  const [buttonDisabledBottle, setButtonDisabledBottle] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const [buttonDisabledOz, setButtonDisabledOz] = useState(true);
  const [buttonDisabledMl, setButtonDisabledMl] = useState(false);

  const [buttonName, setButtonName] = useState("");

  const [bottledType, settype] = useState({
    feed_amount_drunk: "",
    feed_last_side: "",
  });

  const [latestFeeds, setLatestFeeds] = useState([]);

  useEffect(() => {
    //storing start time in localstorage
    localStorage.setItem("startTime", JSON.stringify(feedStartRight));
  }, [feedStartRight]);

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestFeeds();
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

  function msToTime(duration) {
    // let milliseconds = Math.ceil((duration % 1000) / 100);
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  function handleStartTimeForLeft() {
    setFeedStartLeft(Date.now());
    console.log("Left Start");
    setShowResultsLeft(false);
    setFeedStopLeft("");
    console.log(feedStopLeft);
    setSubmitButton(false);
    setButtonName("Left");
    if (showResultsRight === false) {
      handleStopTimeForRight();
    }
  }

  function handleStopTimeForLeft() {
    const stopLeft = Date.now();
    setFeedStopLeft(stopLeft);
    console.log("Left Stop");
    setShowResultsLeft(true);
    setfeedDurationLeft(stopLeft - feedStartLeft);
    const total = totalLeft + (stopLeft - feedStartLeft);
    setTotatlLeft(total);
    setTotalFeedDurationLeft(total);
    console.log(totalFeedDurationLeft);
    setTotatlLeftRight(totalRight + total);
    setButtonName("Left");
  }

  function handleStartTimeForRight() {
    setFeedStartRight(Date.now());
    console.log("Right Start");
    setShowResultsRight(false);
    setFeedStopRight("");
    console.log(feedStopRight);
    setSubmitButton(false);
    setButtonName("Right");
    if (showResultsLeft === false) {
      handleStopTimeForLeft();
    }
  }

  function handleStopTimeForRight() {
    const stopRight = Date.now();
    setFeedStopRight(stopRight);
    console.log("Right Stop");
    setShowResultsRight(true);
    setfeedDurationRight(stopRight - feedStartRight);
    const total = totalRight + (stopRight - feedStartRight);
    setTotalRight(total);
    setTotalFeedDurationRight(total);
    console.log(totalFeedDurationRight);
    setTotatlLeftRight(totalLeft + total);
    setButtonName("Right");
  }

  function handleClickForNursing() {
    setButtonDisabledNursing(true);
    setButtonDisabledBottle(false);
    setShowResults(false);
    console.log("Iam Nursing and disabled", buttonDisabledNursing);
  }

  function handleClickForBottle() {
    setButtonDisabledBottle(true);
    setButtonDisabledNursing(false);
    setShowResults(true);
    console.log("Iam Botle and disabled", buttonDisabledBottle);
  }

  function handleClickForOz() {
    setButtonDisabledOz(true);
    setButtonDisabledMl(false);
    console.log("Iam OZ and disabled", buttonDisabledOz);
  }

  function handleClickForMl() {
    setButtonDisabledOz(false);
    setButtonDisabledMl(true);
    console.log("Iam ML and disabled", buttonDisabledMl);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    // settype({ [name]: value });
    settype((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
    console.log("Bottled:", bottledType);
    setSubmitButtonBottle(false);
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

  const submitTime = async () => {
    const token = await getAccessTokenSilently();
    await fetch(`${API_URL}/feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        feed_type: buttonDisabledNursing ? "Nursing" : "Bottle",
        feed_date: new Date(),
        feed_amount_offered: "200g",
        feed_amount_drunk: "",
        feed_duration: totalLeftRight,
        feed_last_side: buttonName,
        child_id: childId,
        user_id: userId,
      }),
    });
    getLatestFeeds();
  };

  async function getLatestFeeds() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/feeds/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLatestFeeds(data.payload);
  }

  function displayLatestFeeds(feed) {
    const display_date = new Date(feed.feed_date).toLocaleString();
    const key_prop = feed.feed_id;
    const current_feed = feed.feed_type;
    const current_duration = feed.feed_duration;
    const feed_last_side = feed.feed_last_side;
    const amount = feed.feed_amount_drunk;
    const side = feed.feed_amount_offered;
    // const type = feed.feed_last_side;
    return buttonDisabledBottle ? (
      current_feed === "Bottle" ? (
        <p key={key_prop}>
          {display_date} - {current_feed} - {amount + side} - {feed_last_side}
        </p>
      ) : (
        <p key={key_prop}>
          {display_date} - {current_feed} - {msToTime(current_duration)} -{" "}
          {feed_last_side}
        </p>
      )
    ) : current_feed === "Nursing" ? (
      <p key={key_prop}>
        {display_date} - {current_feed} - {msToTime(current_duration)} -{" "}
        {feed_last_side}
      </p>
    ) : (
      <p key={key_prop}>
        {display_date} - {current_feed} - {amount + side} - {feed_last_side}
      </p>
    );
  }
  async function sendFormData() {
    const token = await getAccessTokenSilently();
    await fetch(`${API_URL}/feeds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        feed_type: buttonDisabledBottle ? "Bottle" : "Nursing",
        feed_date: new Date(),
        feed_amount_offered: buttonDisabledMl ? "Ml" : "Oz",
        feed_amount_drunk: bottledType.feed_amount_drunk,
        feed_duration: totalLeftRight,
        feed_last_side: bottledType.feed_last_side,
        child_id: childId,
        user_id: userId,
      }),
    });
    getLatestFeeds();
  }
  const submitAmount = (event) => {
    event.preventDefault();
    sendFormData();
  };

  if (!visible) {
    return <div></div>;
  }

  return (
    <div className="feedTracker-main">
      <Navbar />
      <div className="feedtracker-content">
        <Avatar name="" idName="feedTracker-avatar" />
        <div className="feedsOptionButtons">
          <Button
            btnStyle="ordinarybutton"
            text={`Nursing`}
            onclick={handleClickForNursing}
            disabled={buttonDisabledNursing}
            idName="nursingButton"
          >
            Nursing
          </Button>
          <Button
            btnStyle="ordinarybutton"
            text={`Bottle`}
            onclick={handleClickForBottle}
            disabled={buttonDisabledBottle}
            idName="bottleButton"
          ></Button>
        </div>
        <div className="tracker-content">
          {showResults ? (
            <div className="bottle-form">
              <div className="amountOptionButtons">
                <Button
                  btnStyle="bottlesbutton"
                  text={`oz`}
                  onclick={handleClickForOz}
                  disabled={buttonDisabledOz}
                ></Button>
                <Button
                  btnStyle="bottlesbutton"
                  text={` ml`}
                  onclick={handleClickForMl}
                  disabled={buttonDisabledMl}
                ></Button>
              </div>
              {/* <form className="bootled-form" onSubmit={submitAmount}> */}
              <label>Amount:</label>
              <input
                className="inputArea"
                type="number"
                min={0}
                id="amount"
                name="feed_amount_drunk"
                placeholder="Amount..."
                value={bottledType.feed_amount_drunk}
                onChange={handleChange}
              />
              <div className="type-dropdown">
                <label className="type-dropdown-title">Type:</label>
                <form className="type-select-form">
                  <select
                    id="choose_type"
                    value={bottledType.feed_last_side}
                    onChange={handleChange}
                    name="feed_last_side"
                  >
                    <option value="">--Choose Type--</option>
                    <option value="Breast Milk">Breast Milk</option>
                    <option value="Formula">Formula</option>
                    <option value="Cow Milk">Cow Milk</option>
                    <option value="Goat Milk">Goat Milk</option>
                    <option value="Soy Milk">Soy Milk</option>
                    <option value="Other">Other</option>
                  </select>
                </form>
              </div>
              {/* </form> */}
              <div className="submit-button">
                {showSubmitButtonBottle ? (
                  ""
                ) : (
                  <Button
                    btnStyle="submitButton-feeds"
                    text="Submit"
                    onclick={submitAmount}
                  />
                )}
              </div>
              <div className="feed-latest">
                <h2>Latest feeds:</h2>
                {latestFeeds.map(displayLatestFeeds)}
              </div>
            </div>
          ) : (
            <div className="total-text">
              <div className="feeds-display-container">
                <h3 className="totalFeed">Total Feed Duration: </h3>
                <h3>{msToTime(totalLeftRight)}</h3>
              </div>
              <div className="feedtracker-buttons">
                <div className="leftButton">
                  {showResultsLeft ? (
                    <Button
                      btnStyle="left"
                      onclick={handleStartTimeForLeft}
                      text="LEFT"
                    />
                  ) : (
                    <div className="scaledButton">
                      <Button
                        btnStyle="left"
                        onclick={handleStopTimeForLeft}
                        text="LEFT"
                      />
                    </div>
                  )}
                  <div className="left-text">
                    <p className="feedText-string">Left Last Feed duration: </p>
                    <p className="feedText-time">
                      {msToTime(feedDurationLeft)}
                    </p>
                    <p className="feedText-string">
                      Left Total Feed duration:{" "}
                    </p>
                    <p className="feedText-time">{msToTime(totalLeft)}</p>
                  </div>
                </div>
                <div className="rightButton">
                  {showResultsRight ? (
                    <Button
                      btnStyle="right"
                      text="RIGHT"
                      onclick={handleStartTimeForRight}
                    />
                  ) : (
                    <div className="scaledButton">
                      <Button
                        btnStyle="right"
                        text="RIGHT"
                        onclick={handleStopTimeForRight}
                      />
                    </div>
                  )}
                  <div className="right-text">
                    <p className="feedText-string">
                      Right Last Feed duration:{" "}
                    </p>
                    <p className="feedText-time">
                      {msToTime(feedDurationRight)}
                    </p>
                    <p className="feedText-string">
                      Right Total Feed duration:{" "}
                    </p>
                    <p className="feedText-time">{msToTime(totalRight)}</p>
                  </div>
                </div>
              </div>
              <div className="submit-button">
                {showSubmitButton ? (
                  ""
                ) : (
                  <Button
                    btnStyle="submitButton-feeds"
                    text="Submit"
                    onclick={submitTime}
                  />
                )}
              </div>
              <div className="feed-latest">
                <h2>Latest feeds:</h2>
                {latestFeeds.map(displayLatestFeeds)}
              </div>
            </div>
          )}
          {/* <div className="feed-latest">
            <h2>Latest feeds:</h2>
            {latestFeeds.map(displayLatestFeeds)}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(FeedTracker, {
  onRedirecting: () => <Loading />,
});
