import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { API_URL } from "../../config";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import Navbar from "../../components/Navbar";

import "./UserProfile.css";

function UserProfile() {
  const [children, setChildren] = useState([]);
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
    getChildrenByFamilyId(data.payload[0].family_id);
  }

  async function getChildrenByFamilyId(familyId) {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/families/children/${familyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setChildren(data.payload);
  }

  return (
    <div className="userProfile">
      <Navbar title="User Profile" />
      <div className="userProfile-content">
        <div className="app-avatar">
          <Avatar />
        </div>
        <div className="userProfile-buttons">
          {children.length > 0 && (  
              children.map((child, index) => {
                return(
                  <Link 
                    to={`/childprofile/${child.child_id}`}
                    key={child.child_id}
                  >
                    <Button
                      btnStyle="button-addChildonUserProfile"
                      text={child.child_name}
                    />
                  </Link>)
              })
          )}
          <Link to="/addchild">
            <Button
              btnStyle="button-userProfile"
              text="Create Child Profile"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(UserProfile, {
  onRedirecting: () => <Loading />,
});
