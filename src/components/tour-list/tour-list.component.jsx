import React from "react";
import "./tour-list.style.scss";
import { Tour } from "../tour/tour.component";

export const TourList = ({ tours, handleTourPick }) => {
  return (
    <div className="card-list">
      {tours.map((tour) => (
        <Tour key={tour.placeId} tour={tour} handleTourPick={handleTourPick} />
      ))}
    </div>
  );
};
