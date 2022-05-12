import React, {useState} from "react";
import "./CollapsibleButton.css";


export default function CollapsibleButton(props) {
  const [hidden, toggleHidden] = useState(true)

  function toggleContent() {
    toggleHidden(!hidden);
}
console.log(hidden)

  return (
    <div className="callappsibleButtonContainer">
      <button onClick={toggleContent} className="collapsibleButton" id={props.id}>
      {props.text}
      </button>
      <div className={hidden ? "hidden" : "collapsibleButtonContent"}>
        <p>{props.content}</p>
      </div>
    </div>
    
  );
}
