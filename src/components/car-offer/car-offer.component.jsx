import React from "react";
import "./car-offer.style.scss";

export const CarOffer = ({ offer }) => (
  <div
    className="tour-container image"
    style={{ backgroundImage: `url(${offer.vehicleType.images.native})` }}
  >
    <h2> {offer.amount} </h2>
  </div>
);
