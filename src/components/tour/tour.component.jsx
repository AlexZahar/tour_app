import React from "react";
import "./tour.style.scss";

export const Tour = (props) => (
  <div className="tour-container">
    <h2> {props.tour.city} </h2>
    <p>{props.tour.address}</p>
  </div>
);
