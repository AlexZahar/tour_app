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
    <h3>Date and time: {moment(startDate).format("DD.MM.YYYY - HH:mm")}</h3>
    <h3 className={tourLabel ? "" : "red"}>Selected Tour: {tourLabel}</h3>
    <h3>Duration: {`${duration ? duration + "h" : ""}`}</h3>
    <button
      type="submit"
      onClick={handleSubmit}
      disabled={duration < 1 || !isTourPicked}
    >
      Get offers
    </button>
  </div>
);
