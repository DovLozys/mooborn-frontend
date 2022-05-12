import { Link } from "react-router-dom";
import HamburgerMenu from "../HamburgerMenu";
import mooCowLogo from "../../images/mooCowLogo.png";
import { BiHomeAlt } from "react-icons/bi";
import "./Navbar.css";

function Navbar(props) {
  return (
    <nav className="navbar">
      <img
        className="navbar-logo"
        src={mooCowLogo}
        alt="sleeping cow moo born logo"
      />
      <h1 className="navbar-title">{props.title}</h1>
      <Link style={{ textDecoration: "none", color: "black"}} to="/userprofile"><BiHomeAlt size={28} /></Link>
      <HamburgerMenu />
    </nav>
  );
}

export default Navbar;
