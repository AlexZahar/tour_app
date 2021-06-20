import React from "react";
import "./car-offer-list.style.scss";
import { CarOffer } from "../car-offer/car-offer.component";

export const CarOfferList = ({ offers, handleOfferPick }) => {
  return (
    <div className="card-list">
      {offers.length ? (
        offers.map((offer) => (
          <CarOffer
            key={offer.offerIdentifier}
            offer={offer}
            handleOfferPick={handleOfferPick}
          />
        ))
      ) : (
        <div>
          Please choose a different time or date. <br />
          {offers.message}.
        </div>
      )}
    </div>
  );
};
