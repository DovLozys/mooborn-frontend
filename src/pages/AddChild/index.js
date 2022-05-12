import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button/index";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./AddChild.css";
import "react-datepicker/dist/react-datepicker.css";

function AddChild() {
  const [startDate, setStartDate] = useState(new Date());
  const { user, getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    child_name: "",
    child_sex: "",
    child_dob: dateFormat(startDate, "isoDate"),
    child_birth_weight_lb: 0,
    child_birth_weight_oz: 0,
    child_food_preferences_breast_milk: false,
    child_food_preferences_formula: false,
    child_food_preferences_solids: false,
    child_alergies: "",
    family_id: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getFamilyId();
    // eslint-disable-next-line
  }, []);

  async function getFamilyId() {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/families/?family_name=${user.name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        family_id: data.payload[0].family_id,
      };
    });
  }

  function handleForm(event) {
    const { name, value, checked, type } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value, //use the name property to determine which value is to be checked and a ternary to change the checkbox.
      };
    });
  }

  async function createChild() {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/children`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const status = response.status;
    return status;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const serverStatus = await createChild();

    serverStatus === 200
      ? navigate("/userprofile")
      : console.log(`error ${serverStatus}`);
  }

  return (
    //add validation for name and date of birth so they must be filled in.
    <div className="addChild">
      <Navbar title="Add Child" />
      <div className="addChild-content">
        <div>
          <Avatar name="" idName="addChild-avatar" />
        </div>
        <form className="addChild-form" onSubmit={handleSubmit}>
          <label className="addChild-label">Name:</label>
          <input
            type="text"
            className="addChild-name"
            name="child_name"
            value={formData.child_name}
            onChange={handleForm}
            data-testid="inputChildName"
          />
          <label className="addChild-label">DoB:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setFormData({
                ...formData,
                child_dob: dateFormat(date, "isoDate"),
              });
            }}
            dateFormat="yyyy/MM/dd"
          />
          {/* {console.log(
          `${startDate.getMonth()}/${startDate.getDay()}/${startDate.getFullYear()}`
        )} */}
          <label className="addChild-label">Sex:</label>
          <select
            id="Sex"
            onChange={handleForm}
            name="child_sex"
            value={formData.child_sex}
            data-testid="sexOptions"
          >
            <option value="Male" data-testid="Male">
              {" "}
              Male{" "}
            </option>
            <option value="Female" data-testid="Female">
              {" "}
              Female{" "}
            </option>
            <option value="Other" data-testid="Other">
              {" "}
              Other{" "}
            </option>
          </select>
          <label className="addChild-label">Birth Weight(lbs oz):</label>
          {/* change input field so that it only takes certain value weights */}
          <div className="addChild-weight">
            <input
              type="number"
              min={0}
              className="addChild-birthWeightPounds"
              name="child_birth_weight_lb"
              value={formData.child_birth_weight_lb}
              onChange={handleForm}
              data-testid="weightPounds"
            />
            <span> . </span>
            <input
              type="number"
              min="0"
              max="16"
              className="addChild-birthWeightOunces"
              name="child_birth_weight_oz"
              value={formData.child_birth_weight_oz}
              onChange={handleForm}
              data-testid="weightOunces"
            />
          </div>
          <label className="addChild-label">Allergies:</label>
          <input
            type="text"
            className="addChild-allergies"
            name="child_alergies"
            value={formData.child_alergies}
            onChange={handleForm}
            data-testid="inputChildAllergies"
          />
          <label className="addChild-label">Food Preferences:</label>
          <div className="addChild-foodPreferences">
            <label htmlFor="child_food_preferences_breast_milk">
              Breast Milk
            </label>
            <input
              type="checkbox"
              id="child_food_preferences_breast_milk"
              className="addChild-foodPrefCheckbox"
              name="child_food_preferences_breast_milk"
              onChange={handleForm}
              data-testid="breastmilkCheckBox"
              checked={formData.child_food_preferences_breast_milk}
            />
            {/* <br /> */}
            <label htmlFor="child_food_preferences_formula">Formula</label>
            <input
              type="checkbox"
              id="child_food_preferences_formula"
              className="addChild-foodPrefCheckbox"
              name="child_food_preferences_formula"
              onChange={handleForm}
              data-testid="formulaCheckbox"
              checked={formData.child_food_preferences_formula}
            />
            {/* <br /> */}
            <label htmlFor="child_food_preferences_solids">Solids</label>
            <input
              type="checkbox"
              id="child_food_preferences_solids"
              className="addChild-foodPrefCheckbox"
              name="child_food_preferences_solids"
              onChange={handleForm}
              data-testid="solidsCheckbox"
              checked={formData.child_food_preferences_solids}
            />
          </div>
          <Button
            btnStyle="button-addChild"
            title="Submit"
            text="Submit"
            id="addChild-submitButton"
          />
        </form>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(AddChild, {
  onRedirecting: () => <Loading />,
});
