import React from "react";
import "./car-offer.style.scss";

function currencyFormat(number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
}

export const CarOffer = ({ offer }) => (
  <div className="offer-container">
    <div
      className="offer__background offer-image"
      style={{ backgroundImage: `url(${offer.vehicleType.images.native})` }}
    ></div>
    <p>{offer.vehicleType.title}</p>
    <p>{offer.vehicleType.class}</p>
    <p> {currencyFormat(offer.amount)}</p>
  </div>
);
