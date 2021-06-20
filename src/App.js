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
      isDurationPicked: false,
      isFormSubmitted: false,
    };
  }
  // handleChange = (e) => {
  //   this.setState({ searchField: e.target.value });
  // };
  handleTourPick = (tour) => {
    // console.log("Trigger", id);
    this.setState({
      originPlaceId: tour.id,
      tourLabel: tour.label,
      isTourPicked: true,
    });
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
    // console.log("DURATION", duration);
    console.log("Duration state", this.state.isDurationPicked);
    // converting the user input from hours in minutes
    if (duration >= 1 && duration <= 10) {
      this.setState({
        duration: duration * 60,
        isDurationPicked: true,
      });
    } else {
      this.setState({
        isDurationPicked: false,
      });
      return;
    }
    // switch (duration) {
    //   case duration >= 1:
    //     this.setState({
    //       duration: duration * 60,
    //       isDurationPicked: true,
    //     });
    //     break;
    //   case duration > 10:
    //     alert("Maximum booking time is 10 hours!");
    //     this.setState({
    //       isDurationPicked: false,
    //     });

    //     break;
    //   default:
    //     this.setState({
    //       isDurationPicked: false,
    //     });
    // }
  };
  handleSubmit = async (event) => {
    console.log("event", event.target);
    event.preventDefault();
    // const { tour } = this.state;

    if (!this.state.duration) {
      alert("Pick the tour duration");
      return;
    }
    console.log("this.state.duration", this.state.duration);
    if (this.state.duration > 10 * 60) {
      alert("Maximum booking time is 10 hours!");
      return;
    }
    if (!this.state.isTourPicked) {
      alert("Choose a tour!");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originPlaceId: this.state.originPlaceId,
        selectedStartDate: this.state.startDate.toISOString(true),
        duration: this.state.duration,
        type: this.state.type,
      }),
    };

    fetch("https://www.mydriver.com/api/v5/offers", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          const premiumOffers = [];
          data.forEach((offer) => {
            if (offer.vehicleType.class === "Premium") {
              premiumOffers.push(offer);
            }
          });
          // console.log("Premium", premiumOffer);
          this.setState({ offers: premiumOffers, isFormSubmitted: true });
        } else {
          this.setState({ offers: data, isFormSubmitted: true });
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  calculateMinTime = (date) => {
    let isToday = moment(date).isSame(moment(), "day");
    if (isToday) {
      //To avoid "tooEarlyBookingTime" the closest tour can be picked at a difference of 4 hours from the users current time
      let nowAddHours = moment(new Date()).add({ hours: 4 }).toDate();
      return nowAddHours;
    }
    // For the new dates, the tours will start from 6AM until end of day
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
        minDate: moment(new Date()).add({ hours: 4 }).toDate(),
        startDate: moment(new Date()).add({ hours: 4 }).toDate(),
        isFormSubmitted: false,
      },
      () => console.log("DATA", this.state)
    );
    console.log("DATA", this.state.tours);
  }

  render() {
    const {
      tours,
      offers,
      startDate,
      tourLabel,
      duration,
      isTourPicked,
    } = this.state;

    return (
      <div className="App">
        <form className="sign-up-form" onSubmit={this.handleSubmit}>
          <div className="header">
            <div className="header__datepick">
              <label className="header__action-info">Tour date</label>
              <DatePicker
                // isClearable
                closeOnScroll={false}
                dateFormat="dd.MM.yyyy - HH:mm"
                placeholderText="Pick your tour date"
                selected={this.state.minDate}
                onChange={(date) => this.handleDatePick(date)}
                showTimeSelect
                timeFormat="HH:mm"
                excludeOutOfBoundsTimes
                minDate={moment(new Date()).add({ hours: 4 }).toDate()}
                minTime={this.state.minTime}
                maxTime={moment().endOf("day").toDate()} // set to 23:59 pm today
                withPortal
                className={this.state.startDate ? "" : "error"}
                required
              />
            </div>
            <div className="header__duration">
              <label className="header__action-info">Duration(h)</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                required
                placeholder="hour"
                label="1"
                step="0.1"
                max="10"
                className={this.state.isDurationPicked ? "" : "error"}
                onChange={(duration) =>
                  this.handleTourDuration(duration.target.value)
                }
              />
            </div>
          </div>
        </form>

        <h1>Munich Sightseeing</h1>
        <TourList tours={tours} handleTourPick={this.handleTourPick}></TourList>
        <h3>Date and time: {moment(startDate).format("DD.MM.YYYY - HH:mm")}</h3>
        <h3>Tour: {tourLabel} </h3>
        <h3>Duration: {`${duration ? duration / 60 + "h" : ""}`}</h3>
        <button type="submit" onClick={this.handleSubmit}>
          Get offers
        </button>
        {this.state.isFormSubmitted ? <CarOfferList offers={offers} /> : null}
      </div>
    );
  }
}

export default App;
