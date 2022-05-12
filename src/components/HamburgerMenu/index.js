import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth0 } from "@auth0/auth0-react";
import "./HamburgerMenu.css";

function HamburgerMenu() {
  const [hamburgerHidden, setHamburgerHidden] = useState(true);

  const { isAuthenticated } = useAuth0();

  function togglehamburgerHidden() {
    setHamburgerHidden(!hamburgerHidden);
  }

  return (
    <div className="hamburger-dropdown">
      <button onClick={togglehamburgerHidden} className="hamburger-dropbtn">
        <GiHamburgerMenu size={28} />{" "}
      </button>
      <div
        className={
          hamburgerHidden ? "hidden hamburger-content" : "hamburger-content"
        }
      >
        <Link style={{ textDecoration: "none" }} to="/userprofile">
          <p>User Profile</p>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/addchild">
          <p>Add Child</p>
        </Link>
        {isAuthenticated ? (
          <LogoutButton styles="hamburger-logout" logoutid="hamburger-logout" />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default HamburgerMenu;
