import React from "react";
import "./tour-details.style.scss";
import moment from "moment";

function currencyFormat(number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
}

export const TourDetails = ({
  startDate,
  tourLabel,
  duration,
  address,
  offerPrice,
  offerName,
}) => (
  <div className="tour__wrapper">
    {console.log("NAME", offerName)}
    {console.log("PRICE", offerPrice)}
    <div className="tour tour__details-container">
      <span className={startDate ? "" : "red"}>
        Date and time:{" "}
        <strong>
          {" "}
          {startDate ? moment(startDate).format("DD.MM.YYYY - HH:mm") : ""}
        </strong>
      </span>
      <span className={tourLabel ? "" : "red"}>
        Selected Tour: <strong>{tourLabel} </strong>{" "}
      </span>
      <span className={tourLabel ? "" : "red"}>
        Address: <strong>{address} </strong>{" "}
      </span>
      <span className={duration ? "" : "red"}>
        Duration: <strong>{`${duration ? duration + "h" : ""}`}</strong>
      </span>
      <span className={offerName ? "" : "red"}>
        Offer: <strong>{offerName}</strong>
      </span>
      <span className={offerPrice ? "" : "red"}>
        Price: <strong>{currencyFormat(offerPrice)}</strong>
      </span>
    </div>
  </div>
);
