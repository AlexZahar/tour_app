import React from "react";
import "./App.css";
import { TourList } from "./components/tour-list/tour-list.component";
import { SearchBox } from "./components/search-box/search-box.component";
import { DEFAULT_TOURS_DATA } from "./assets/data/tours/default-tours.data";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CarOfferList } from "./components/car-offer-list/car-offer-list.component";
import { TourDetails } from "./components/tour-details/tour-details.component";
import "react-datepicker/dist/react-datepicker.css";
// import { Datepicker } from "./components/date-picker/date-picker.component";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

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
      isLoading: true,
      spinnerColor: "#39DBBB",
    };
  }

  handleSearch = (e) => {
    if (e.target.value.length) {
      this.setState({ isLoading: true, offers: [], isTourPicked: false });
      fetch(
        `https://www.mydriver.com/api/v5/locations/autocomplete?searchString=${e.target.value}`
      )
        .then((response) => response.json())
        .then((data) => {
          const munichLocations = [];
          console.log(data);
          if (data.length) {
            data.forEach((e) => {
              if (e.city === "München") {
                munichLocations.push(e);
              }
            });
            this.setState({
              tours: munichLocations,
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        tours: DEFAULT_TOURS_DATA,
      });
    }
  };
  handleTourPick = (tour) => {
    // console.log("Trigger", id);
    console.log("PICKED TOUR", tour);
    this.setState(
      {
        originPlaceId: tour.placeId,
        tourLabel: tour.label,
        isTourPicked: true,
      },
      () => {
        console.log("ORIGINPLACEID", this.state.originPlaceId);
      }
    );
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

  handleTourDuration = (e) => {
    const duration = e.target.value;
    if (duration === "") {
      this.setState({
        duration: "",
        isDurationPicked: true,
      });
    }

    // converting the user input from hours in minutes
    if (parseFloat(duration) >= 1 && parseFloat(duration) <= 10) {
      this.setState({
        duration: duration,
        isDurationPicked: true,
      });
      return;
    }
    if (parseFloat(duration) > 10) {
      this.setState({
        duration: "10",
        isDurationPicked: false,
      });
      alert("tour duration can't be longer than 10 hours");
      return;
    }

    this.setState({
      isDurationPicked: false,
    });
    return;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // const { tour } = this.state;
    this.setState({ isLoading: true, offers: [] });
    if (!this.state.duration) {
      alert("Pick the tour duration");
      return;
    }
    if (!this.state.originPlaceId) {
      alert("ID undefined");
      return;
    }
    console.log("this.state.duration", this.state.duration);
    if (parseFloat(this.state.duration) > 10) {
      // alert("Maximum booking time is 10 hours!");
      this.setState({ duration: "10" });
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
        duration: this.state.duration * 60,
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
          this.setState({
            offers: premiumOffers,
            isFormSubmitted: true,
            isLoading: false,
          });
        } else {
          this.setState({
            offers: data,
            isFormSubmitted: true,
            isLoading: false,
          });
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
    this.setState(
      {
        tours: DEFAULT_TOURS_DATA,
        minTime: this.calculateMinTime(new Date()),
        minDate: moment(new Date()).add({ hours: 4 }).toDate(),
        startDate: moment(new Date()).add({ hours: 4 }).toDate(),
        isFormSubmitted: false,
        duration: "1",
        isLoading: false,
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
      spinnerColor,
      isLoading,
    } = this.state;

    return (
      <div className="App">
        <form className="sign-up-form" onSubmit={this.handleSubmit}>
          <div className="header">
            <div className="header__datepick">
              <label className="header__action-info">Next tour date</label>
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
                value={this.state.duration}
                step="0.1"
                max="10"
                className={
                  parseFloat(this.state.duration) >= 1 &&
                  parseFloat(this.state.duration) <= 10
                    ? ""
                    : "error"
                }
                onChange={this.handleTourDuration}
              />
            </div>
          </div>
        </form>

        <h1>Munich Sightseeing</h1>
        <h3>Pick up one of the default tours or search for a new one</h3>
        <SearchBox handleSearch={this.handleSearch}></SearchBox>
        <RingLoader
          color={spinnerColor}
          loading={isLoading}
          css={override}
          size={80}
        />
        {!isLoading ? (
          <TourList
            tours={tours}
            handleTourPick={this.handleTourPick}
          ></TourList>
        ) : null}
        {isTourPicked && !isLoading ? (
          <TourDetails
            startDate={startDate}
            isTourPicked={isTourPicked}
            tourLabel={tourLabel}
            duration={duration}
            handleSubmit={this.handleSubmit}
          ></TourDetails>
        ) : null}
        {this.state.isFormSubmitted ? <CarOfferList offers={offers} /> : null}
      </div>
    );
  }
}

export default App;
