import React from "react";
import mooBornLogo from "../../images/teddyBear.png";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <img className="footer-logo" src={mooBornLogo} alt="moo born logo" />
      <ul className="footer-links">
        <Link to="contactus"><li>Contact Us</li></Link>
        <Link to="aboutus">
          <li>About Us</li>
        </Link>
      </ul>
    </footer>
  );
}
