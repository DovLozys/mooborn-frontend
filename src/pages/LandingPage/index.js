import AuthenticationButton from "../../components/AuthenticationButton";

import "./LandingPage.css";
import MoocowLogo from "../../images/mooCowLogo.png";

function LandingPage() {
  return (
    <div className="landingPage">
      <div className="landingPage-content">
        <div className="container-new">
          <h1>MooBorn - Connecting baby's world</h1>
          <img
            className="Sleepingcowlogo"
            src={MoocowLogo}
            alt="Sleeping Cow Logo"
          />
          <div className="Loginbuttonstyling" id="Loginsignupbutton">
            <AuthenticationButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
