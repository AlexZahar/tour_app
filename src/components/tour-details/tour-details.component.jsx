import React from "react";
import "./tour-details.style.scss";
import moment from "moment";

export const TourDetails = ({ startDate, tourLabel, duration, address }) => (
  <div className="tour__wrapper">
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
    </div>
  </div>
);
