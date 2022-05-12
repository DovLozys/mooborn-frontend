import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { API_URL } from "../../config";

import { useEmailCheck } from "../../hooks/useEmailCheck";

import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";
import Avatar from "../../components/Avatar";

import "./UserRoleChooser.css";

function UserRoleChooser() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [emailFound] = useEmailCheck();

  useEffect(() => {
    if (emailFound) {
      navigate("/userprofile");
    }
  }, [emailFound, navigate]);

  async function sendNewFamily(familyNameObj) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/families`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(familyNameObj),
    });

    // data will contain family_id
    const data = await res.json();
    console.log('sendNewFamily: ', data);
    return data.payload[0];
  }

  async function sendNewUser(newUserObj) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUserObj),
    });

    // data will contain whole user
    const data = await res.json();
    console.log('sendNewUser: ', data);
  }

  async function checkFamilyExists() {
    if(role === ""){
      alert("Please select a role to proceed");
      return
    }

    // setNewFamily({family_name: user.name});
    const familyNameObj = {family_name: user.name}
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/families/?family_name=${user.name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // data.payload.family_id will contain family_id
    const data = await res.json();
    console.log('checkFamilyExists: ', user.name)

    if (data.payload.length < 1) {
      // POST the family to DB
      const insertedFamily = await sendNewFamily(familyNameObj); //get family id back from this
      //setNewUser({...newUser, family_id: insertedFamily.family_id})
      const newUserObj = {user_name: user.name, user_email: user.email, user_role: role, family_id: insertedFamily.family_id};
      // run createUser function
      sendNewUser(newUserObj);
      // navigate out of here
      navigate("/userprofile");
    }
  }

  function handleChange(event) {
    setRole(event.target.value);
  }

  return (
    <div className="role">
      <Navbar title="SIGN UP" />
      <div className="role-main">
        <div className="app-avatar">
          <Avatar name="" />
        </div>
        <div className="role-form">
          <div className="role-dropdown">
            <h3 className="role-dropdown-title">Childcare role:</h3>
            <form className="role-select-form">
              <select
                id="choose_role"
                value={role.userRole}
                onChange={handleChange}
                name="userRole"
              >
                <option value="">--Choose Role--</option>
                <option value="Parent">Parent</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Nanny">Nanny</option>
                <option value="Babysitter">Babysitter</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </form>
          </div>
          <div className="role-buttons">
            <Button onclick={checkFamilyExists} text="Submit" btnStyle="button-role" />
            <Button text="Join Family" btnStyle="button-role" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(UserRoleChooser, {
  onRedirecting: () => <Loading />,
});
