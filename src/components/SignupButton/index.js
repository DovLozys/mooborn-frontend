import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../../components/Button/Button.css";

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      className="button"
      onClick={() =>
        loginWithRedirect({
          screen_hint: "signup",
        })
      }
    >
      Login/Sign Up
    </button>
  );
};

export default SignupButton;
