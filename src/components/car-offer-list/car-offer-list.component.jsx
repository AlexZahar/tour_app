import React from "react";
import "./car-offer-list.style.scss";
import { CarOffer } from "../car-offer/car-offer.component";

export const CarOfferList = ({ offers, handleOfferPick }) => {
  console.log("QQQQQ", offers);
  return (
    <div className="card-list">
      {offers.map((offer) => (
        <CarOffer
          key={offer.offerIdentifier}
          offer={offer}
          handleOfferPick={handleOfferPick}
        />
      ))}
    </div>
  );
};
