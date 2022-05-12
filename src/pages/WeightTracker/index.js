import { useState, useEffect } from "react";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";
import "./WeightTracker.css";

function WeightTracker() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);

  const { user, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(0);

  const [latestWeights, setLatestWeights] = useState([]);

  const [formData, setFormData] = useState({
    child_current_weight_lb: 0,
    child_current_weight_oz: 0,
    child_current_height_ft: 0,
    child_current_height_in: 0,
    child_current_weight_fb3: 0,
    child_current_head_in: 0,
    child_current_head_in2: 0,
  });

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestWeights();
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

  async function getLatestWeights() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/weights/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLatestWeights(data.payload);
  }

  function displayLatestWeights(weight) {
    const display_date = new Date(weight.weight_date).toLocaleString();
    const key_prop = weight.weight_id;
    const current_weight_lb = weight.weight_lb;
    const current_weight_oz = weight.weight_oz;

    return (
      <p key={key_prop}>
        {display_date} - {`${current_weight_lb}lb, ${current_weight_oz}oz`}
      </p>
    );
  }

  //get user id
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

  async function postWeight() {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/weights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weight_date: new Date(),
        weight_lb: formData.child_current_weight_lb,
        weight_oz: formData.child_current_weight_oz,
        child_id: childId,
        user_id: userId,
      }),
    });

    const data = await response.json();
    getLatestWeights();
    console.log(data);
  }

  //set the form state tomatch the user input value.
  function handleForm(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    postWeight();
  };

  if (!visible) {
    return <div></div>;
  }

  return (
    <main>
      <Navbar />
      <div className="weight-content">
        <Avatar idName="weights-avatar" />
        <div className="weight-info">
          <form className="weightTracker-form" onSubmit={handleSubmit}>
            <label className="addChild-label">Curent Weight(lbs oz):</label>
            {/* change input field so that it only takes certain value weights */}
            <div className="addChildCurrent-weight">
              <input
                type="number"
                min="0"
                className="addChild-currentWeightPounds"
                name="child_current_weight_lb"
                value={formData.child_current_weight_lb}
                onChange={handleForm}
                data-testid="weightPounds"
              />
              <span> . </span>
              <input
                type="number"
                min="0"
                max="16"
                className="addChild-currentWeightOunces"
                name="child_current_weight_oz"
                value={formData.child_current_weight_oz}
                onChange={handleForm}
                data-testid="weightOunces"
              />
            </div>
            <label className="addChild-label">Curent Height(ft):</label>
            {/* change input field so that it only takes certain value weights */}
            <div className="addChildCurrent-height">
              <input
                type="number"
                min="0"
                max="7"
                className="addChild-currentHeightPounds"
                name="child_current_height_ft"
                value={formData.child_current_height_ft}
                onChange={handleForm}
                data-testid="heightFt"
              />
              <span> . </span>
              <input
                type="number"
                min="0"
                max="11"
                className="addChild-currentHeightInces"
                name="child_current_height_in"
                value={formData.child_current_height_in}
                onChange={handleForm}
                data-testid="heightFt2"
              />
              <label className="addChild-label">
                Curent Head Circumference(in):
              </label>
              <input
                type="number"
                min="0"
                max="39"
                className="addChild-currentHead"
                name="child_current_head_in"
                value={formData.child_current_head_in}
                onChange={handleForm}
                data-testid="headInch"
              />
              <span> . </span>
              <input
                type="number"
                min="0"
                max="9"
                className="addChild-currenHead"
                name="child_current_head_in"
                value={formData.child_current_head_in2}
                onChange={handleForm}
                data-testid="HeadInch2"
              />
            </div>
            <Button
              btnStyle="button-addWeight"
              title="Submit"
              text="Submit"
              btnId="addWeight-submitButton"
            />
          </form>
          <div className="weights-latest">
            <h2>Latest weights:</h2>
            {latestWeights.map(displayLatestWeights)}
          </div>
        </div>
      </div>
    </main>
  );
}
export default withAuthenticationRequired(WeightTracker, {
  onRedirecting: () => <Loading />,
});
