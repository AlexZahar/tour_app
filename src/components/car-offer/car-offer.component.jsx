import React from "react";
import "./car-offer.style.scss";

function currencyFormat(number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
}

export const CarOffer = ({ offer }) => (
  <div className="offer offer-container">
    <div
      className="offer__background offer-image"
      style={{ backgroundImage: `url(${offer.vehicleType.images.native})` }}
    ></div>
    <div className="offer__data">
      <span>
        Name: <strong> {offer.vehicleType.name}</strong>
      </span>
      <span>
        Class: <strong> {offer.vehicleType.class}</strong>
      </span>
      <span>
        Passengers: <strong>{offer.vehicleType.nrOfPassengers} </strong>
      </span>
      <span>
        Baggage: <strong> {offer.vehicleType.nrOfBaggage}</strong>
      </span>
      <span>
        Price: <strong> {currencyFormat(offer.amount)}</strong>
      </span>
    </div>
  </div>
);
