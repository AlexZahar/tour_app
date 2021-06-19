import React from "react";
import "./tour.style.scss";

export const Tour = ({ tour, handleTourPick }) => (
  <div
    className="tour-container image"
    style={{ backgroundImage: `url(${tour.imageUrl})` }}
    onClick={() => {
      handleTourPick(tour);
      console.log("tour", tour);
    }}
  >
    <h2> {tour.label} </h2>
    <p>{tour.address}</p>
  </div>
);
