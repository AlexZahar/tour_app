import React from "react";
import "./tour-list.style.scss";
import { Tour } from "../tour/tour.component";

export const TourList = (props) => {
  return (
    <div className="card-list">
      {props.tours.map((tour) => (
        <Tour key={tour.id} tour={tour} />
      ))}
    </div>
  );
};
