import React from "react";
import "./tour-details.style.scss";
import moment from "moment";

export const TourDetails = ({
  startDate,
  isTourPicked,
  tourLabel,
  duration,
  handleSubmit,
}) => (
  <div>
    <button
      type="submit"
      onClick={handleSubmit}
      disabled={duration < 1 || !isTourPicked}
    >
      Check offers
    </button>
    <h3 className={startDate ? "" : "red"}>
      Date and time:{" "}
      {startDate ? moment(startDate).format("DD.MM.YYYY - HH:mm") : ""}
    </h3>
    <h3 className={tourLabel ? "" : "red"}>Selected Tour: {tourLabel}</h3>
    <h3 className={duration ? "" : "red"}>
      Duration: {`${duration ? duration + "h" : ""}`}
    </h3>
  </div>
);
