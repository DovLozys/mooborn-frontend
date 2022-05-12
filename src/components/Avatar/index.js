import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import "./Avatar.css";

function Avatar({ idName }) {
  const [initials, setInitials] = useState("");
  const { user } = useAuth0();

  const name = user.name.toUpperCase();

  useEffect(() => {
    if (name.includes(" ")) {
      const splitName = name.split(" ");
      setInitials(splitName[0][0] + splitName[1][0]);
    } else {
      setInitials(name[0]);
    }
  }, [name]);

  return (
    <h2 className="avatar-name" id={idName}>
      {initials}
    </h2>
  );
}

export default Avatar;
