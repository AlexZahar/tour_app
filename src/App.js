import React from "react";
import "./App.css";
import { TourList } from "./components/tour-list/tour-list.component";
import { SearchBox } from "./components/search-box/search-box.component";
import { DEFAULT_TOURS_DATA } from "./assets/data/tours/default-tours.data";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CarOfferList } from "./components/car-offer-list/car-offer-list.component";

import "react-datepicker/dist/react-datepicker.css";
// import { Datepicker } from "./components/date-picker/date-picker.component";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tours: [],
      offers: [],
      tourSearch: "",
      originPlaceId: "",
      selectedStartDate: "2021-11-22T12:45:00+02:00",
      duration: "",
      type: "DURATION",
      startDate: new Date(),
      minTime: "",
      minDate: "",
      tourLabel: "",
      isTourPicked: false,
    };
  }
  // handleChange = (e) => {
  //   this.setState({ searchField: e.target.value });
  // };
  handleTourPick = (tour) => {
    // console.log("Trigger", id);
    this.setState({ pickedTourId: tour.id, tourLabel: tour.label }, () =>
      console.log("TOUR2", this.state.tourLabel)
    );

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originPlaceId: tour.id,
        selectedStartDate: this.state.startDate.toISOString(true),
        duration: this.state.duration,
        type: this.state.type,
      }),
    };
    fetch("https://www.mydriver.com/api/v5/offers", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESPONSE", data);
        this.setState({ offers: data }, () =>
          console.log("OFFERS", this.state.offers)
        );
      })
      .catch((err) => {
        console.warn(err);
      });
    // console.log();
  };
  handleDatePick = (date) => {
    this.setState(
      {
        startDate: date,
        minTime: this.calculateMinTime(date),
        minDate: date,
      },
      () => console.log("Datepick", this.state)
    );
  };
  handleTourDuration = (duration) => {
    console.log("DURATION", duration);
    // converting the user input from hours in minutes
    this.setState(
      {
        duration: duration * 60,
      },
      () => console.log("Duration", this.state.duration)
    );
  };
  calculateMinTime = (date) => {
    let isToday = moment(date).isSame(moment(), "day");
    if (isToday) {
      //To avoid "tooEarlyBookingTime" the closest tour can be picked at a difference of 6 hours from the users current time
      let nowAddOneHour = moment(new Date()).add({ hours: 6 }).toDate();
      return nowAddOneHour;
    }
    // For the new dates, the tours will start from 6AM
    return moment(date).startOf("day").add({ hours: 6 }).toDate();
  };
  componentDidMount() {
    // fetch(
    //   "https://www.mydriver.com/api/v5/locations/autocomplete?searchString=Nymphenburg"
    // )
    //   .then((response) => response.json())
    //   .then((tours) => {
    //     console.log(tours);
    //   });
    this.setState(
      {
        tours: DEFAULT_TOURS_DATA,
        minTime: this.calculateMinTime(new Date()),
        minDate: moment(new Date()).add({ hours: 6 }).toDate(),
      },
      () => console.log("DATA", this.state)
    );
    console.log("DATA", this.state.tours);
  }

  render() {
    const {
      tours,
      offers,
      tourSearch,
      startDate,
      tourLabel,
      isTourPicked,
      duration,
    } = this.state;

    return (
      <div className="App">
        <div className="header">
          <div className="header__datepick">
            <span className="header__action-info">Tour date</span>
            <DatePicker
              // isClearable
              closeOnScroll={true}
              dateFormat="dd.MM.yyyy - HH:mm"
              placeholderText="Pick your tour date"
              selected={this.state.minDate}
              onChange={(date) => this.handleDatePick(date)}
              style={{ border: "solid 1px pink" }}
              showTimeSelect
              timeFormat="HH:mm"
              excludeOutOfBoundsTimes
              minDate={moment(new Date()).add({ hours: 6 }).toDate()}
              minTime={this.state.minTime}
              maxTime={moment().endOf("day").toDate()} // set to 23:59 pm today
              withPortal
              required
            />
          </div>
          <div className="header__duration">
            <span className="header__action-info">Duration</span>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              required
              placeholder="1h"
              step="0.1"
              max="10"
              onChange={(duration) =>
                this.handleTourDuration(duration.target.value)
              }
            />
          </div>
        </div>
        <h1>Munich Sightseeing</h1>
        <TourList tours={tours} handleTourPick={this.handleTourPick}></TourList>
        <h3>
          Date and time of the sighseeing:{" "}
          {moment(startDate).format("DD.MM.YYYY - HH:mm")}
        </h3>

        <h3>Selected Tour {tourLabel} </h3>
        <h3>Tour Duration {duration / 60}h</h3>
        <CarOfferList offers={offers} />
      </div>
    );
  }
}

export default App;
