import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

import { API_URL } from "../../config";

import "./Show.css";

function Show() {
  const [error, setError] = useState("");
  const { getAccessTokenSilently } = useAuth0();


  async function getUsers() {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/families`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success === true) {
        console.log(data);
        setError("");
      } else {
        setError("Fetch didn't work :(");
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  if (error !== "") {
    return (
      <div>
        <p className="Show_error-text">{error}</p>
      </div>
    );
  }

  return (
    <ul>
      <button onClick={getUsers}>getUsers</button>
    </ul>
  );
}

export default Show;
