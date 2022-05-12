import { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./SolidsTracker.css";

function SolidsTracker() {
  const foodArray = [
    "🥑",
    "🍌",
    "🍎",
    "🍠",
    "🍗",
    "🍐",
    "🥕",
    "🥦",
    "🥒",
    "🍉",
    "🥭",
    "🥚",
    "🍓",
    "🍝",
    "🫐",
    "🍊",
    "🍇",
    "🍒",
    "🍑",
    "🍍",
    "🥝",
    "🥬",
    "🫑",
    "🌽",
    "🥔",
    "🍞",
    "🐟",
    "🧀",
    "🍅",
    "🍆",
    "🧅",
    "🧄",
  ];

  const foodArrayName = [
    "avocado",
    "banana",
    "apple",
    "sweet potato",
    "chicken",
    "pear",
    "carrot",
    "broccoli",
    "cucumber",
    "watermelon",
    "mango",
    "egg",
    "strawberry",
    "pasta",
    "blueberry",
    "orange",
    "grape",
    "cherry",
    "peach",
    "pineapple",
    "kiwi",
    "lettuce",
    "bell pepper",
    "corn",
    "potato",
    "bread",
    "fish",
    "cheese",
    "tomato",
    "aubergine",
    "onion",
    "garlic",
  ];

  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);

  const [userId, setUserId] = useState(0);
  const [checkedState, setCheckState] = useState(
    new Array(foodArray.length).fill(false)
  );
  const [showSubmitButton, setSubmitButton] = useState(true);
  const [inputItems, setInputItems] = useState("");
  const [latestSolids, setLatestSolids] = useState([]);

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFamilyId();
    getUserId();
    getLatestSolids();
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

  function handleOnChange(position) {
    setSubmitButton(false);

    const updatedCheckState = checkedState.map((item, index) =>
    index === position ? !item : item
    );
    
    setCheckState(updatedCheckState);
  };

  function handleInputChange(event) {
    setSubmitButton(false);
    
    setInputItems(event.target.value);
  }

  async function getLatestSolids() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/feeds/solids/${childId}/3`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    setLatestSolids(data.payload);
  }
  
  function displayLatestSolids(solid) {
    const display_date = new Date(solid.feed_date).toLocaleString();
    const key_prop = solid.feed_id;
    const solid_feed = solid.feed_type;

    return(
      <p key={key_prop}>
        {display_date} - {solid_feed}
      </p>
    )
  } 
  
  // TODO: Check if no boxes are ticked and prevent POST
  async function submitSolids() {
    const arrayOfFoods = [];
    
    checkedState.forEach((currentState, index) => {
      if (currentState === true) {
        arrayOfFoods.push(foodArrayName[index]);
      }
    });
    
    if (inputItems !== "") {
      arrayOfFoods.push(inputItems);
    }
    
    const token = await getAccessTokenSilently();
    await fetch(`${API_URL}/feeds/solids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        feed_type: arrayOfFoods.toString(),
        feed_date: new Date(),
        feed_amount_offered: "200g",
        child_id: childId,
        user_id: userId
      }),
    });

    getLatestSolids();
    setCheckState(new Array(foodArray.length).fill(false));
  }
  
  if (!visible) {
    return <div></div>
  }

  return (
    <main>
      <Navbar />
      <div className="solidstracker-content">
        <div className="app-avatar">
          <Avatar name="" />
        </div>
        <div className="full-solids-content">
          <div className="solids-content">
            <input
              className="inputAreaSolids"
              type="text"
              id="solids"
              name="solids"
              placeholder="Food..."
              onChange={handleInputChange}
            />
            {showSubmitButton ? (
              ""
              ) : (
              <div className="solidsTracker-btn">
                <Button
                  btnStyle="submitButton-solids"
                  text="Submit"
                  onclick={submitSolids}
                  />
              </div>
            )}
          </div>
          <div className="checkBoxes">
            <div>
              <h3>Most popular foods</h3>
            </div>
            <ul className="food-list">
              {foodArray.map((food, index) => {
                return (
                  <li key={index}>
                    <div className="foods-list-item">
                      <input
                        type="checkbox"
                        id={`custom-checkbox-${index}`}
                        name={food}
                        value={food}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                      />
                      <label htmlFor={`custom-checkbox-${index}`}>{food}</label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="solids-latest">
            <h2>Latest solids:</h2>
            {latestSolids.map(displayLatestSolids)}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuthenticationRequired(SolidsTracker, {
  onRedirecting: () => <Loading />,
});
