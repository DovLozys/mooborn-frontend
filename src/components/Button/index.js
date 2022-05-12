import React from "react";
import "./Button.css";

export default function Button(props) {
  return (
    <button
      onClick={props.onclick}
      className={props.btnStyle}
      disabled={props.disabled}
      id={props.btnId}
    >
      {props.text}
    </button>
  );
}
