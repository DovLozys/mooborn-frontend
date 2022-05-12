import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button/index";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./ChildProfile.css";

function ChildProfile() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const childId = parseInt(params.childId);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getFamilyId();
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
  
  if (!visible) {
    return <div></div>
  }

  return (
    <main className="childProfile-main">
      <Navbar />
      <div className="childProfile-content">
        {/* <div className="childProfile-avatar"> */}
          <Avatar name="" idName="childProfile-avatar"/>
        {/* </div> */}
        <div className="childProfile-buttons">
          <Link to={`/sleeptracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Sleep"
              btnId="sleep-color-button"
            />
          </Link>
          <Link to={`/feedtracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Feeding"
              btnId="feeding-color-button"
            />
          </Link>
          <Link to={`/solidtracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Solids"
              btnId="solid-color-button"
            />
          </Link>
          <Link to={`/temperaturetracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Temperature"
              btnId="temperature-color-button"
              //to display last known temp, look in temp table for the last recorded temp(function to compare times or just latest id)
            />
          </Link>
          <Link to={`/nappytracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Nappies"
              btnId="nappy-color-button"
            />
          </Link>
          <Link to={`/weighttracker/${childId}`}>
            <Button
              btnStyle="button-childProfile"
              text="Weight"
              btnId="weight-color-button"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default withAuthenticationRequired(ChildProfile, {
  onRedirecting: () => <Loading />,
});
