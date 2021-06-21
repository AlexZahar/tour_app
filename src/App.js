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
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";

// Loader CSS
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
      searchInput: "",
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
      isOfferPicked: false,
      isLoading: true,
      spinnerColor: "#39DBBB",
      address: "",
      offerName: "",
      offerPrice: "",
    };
  }

  // Search logic implementation. Displays in real time the tour options, based on user's search input. These offers are filtered to include only the tours available in Munich
  handleSearch = (e) => {
    if (e.target.value.length) {
      this.setState({
        isLoading: true,
        offers: [],
        isTourPicked: false,
        searchInput: e.target.value,
      });
      fetch(
        `https://www.mydriver.com/api/v5/locations/autocomplete?searchString=${e.target.value}`
      )
        .then((response) => response.json())
        .then((data) => {
          const munichLocations = [];

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
          } else {
            this.setState({
              isLoading: false,
              tours: DEFAULT_TOURS_DATA,
            });
          }
        });
    } else {
      this.setState({
        tours: DEFAULT_TOURS_DATA,
        searchInput: "",
      });
    }
  };

  // Each time a tour is picked, the state is updated
  handleTourPick = (tour) => {
    this.setState({
      originPlaceId: tour.placeId,
      tourLabel: tour.label,
      isTourPicked: true,
      offers: [],
      address: tour.address,
      isOfferPicked: false,
    });
  };

  // After picking an offer, the details component is updated to show valid data
  handleOfferPick = (offer) => {
    console.log("PICKED", offer);
    this.setState({
      offerName: offer.vehicleType.name,
      offerPrice: offer.amount,
      isOfferPicked: true,
    });
    this.scrollToBottom();
  };
  // Due to the increased size of the tours, the Tour details component is not noticebale after picking an offer. The user has to scroll manually, therefore I created this utility function
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  // Once the tour offer has been confirmed, the app comes back in it's initial state
  handleConfirmOffer = () => {
    if (window.confirm(`Are you sure you want to proceed?`)) {
      console.log("Offer confirmed");
      this.setState({
        isTourPicked: false,
        isLoading: false,
      });
      alert(
        `Thank you for booking the tour! Have a wonderfull time in Munich:)`
      );
    }
    return;
  };

  // The nearest valid tour period will be picked by default, based on the user current time. The date and time can be freely chosen by the user but with slight restrictions
  handleDatePick = (date) => {
    this.setState({
      startDate: date,
      minTime: this.calculateMinTime(date),
      minDate: date,
    });
  };

  // Tour duration logic. The duration can't be less than 1 hour or greater than 10 hours
  handleTourDuration = (e) => {
    const duration = e.target.value;
    if (duration === "") {
      this.setState({
        duration: "",
        isDurationPicked: true,
      });
    }

    if (parseFloat(duration) >= 1 && parseFloat(duration) <= 10) {
      this.setState({
        duration: duration,
        isDurationPicked: true,
        isOfferPicked: false,
        isTourPicked: false,
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

  // Once the user picked all the required data for the tour, then submit and get back the car offers
  handleSubmit = (event) => {
    event.preventDefault();
    // const { tour } = this.state;
    this.setState({ isLoading: true, offers: [] });

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

  // Handle the tour time options
  calculateMinTime = (date) => {
    let isToday = moment(date).isSame(moment(), "day");
    if (isToday) {
      //To avoid "tooEarlyBookingTime" error, the closest tour can be picked at a difference of 3.5 hours from the users current time. I am going for a 4 hours mark
      let nowAddHours = moment(new Date()).add({ hours: 4 }).toDate();
      return nowAddHours;
    }
    // For the new dates, the tours will start from 6AM until end of day
    return moment(date).startOf("day").add({ hours: 6 }).toDate();
  };

  componentDidMount() {
    this.setState({
      tours: DEFAULT_TOURS_DATA,
      minTime: this.calculateMinTime(new Date()),
      minDate: moment(new Date()).add({ hours: 4 }).toDate(),
      startDate: moment(new Date()).add({ hours: 4 }).toDate(),
      isFormSubmitted: false,
      duration: "1",
      isLoading: false,
      isOfferPicked: false,
    });
  }

  // If you were not lucky in finding any new tours, come back any time to the default ones!
  handleShowDefaultTours = () => {
    this.setState({
      searchInput: "",
      isLoading: false,
      tours: DEFAULT_TOURS_DATA,
    });
  };
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
      searchInput,
      address,
      offerName,
      offerPrice,
      isOfferPicked,
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

        <h1>Welcome to Munich!</h1>
        <h3>Want to know more about this wonderfull city?</h3>
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
        {!isLoading && !tours.length ? (
          <div>
            <h4>Nothing found in Munich to match your search: {searchInput}</h4>
            <a href="/" onClick={this.handleShowDefaultTours}>
              Back to the default tours
            </a>
          </div>
        ) : null}
        {!isLoading && isTourPicked ? (
          <button
            type="submit"
            className="btn btn__get-offer"
            onClick={this.handleSubmit}
            disabled={duration < 1 || !isTourPicked}
          >
            Check offers
          </button>
        ) : null}
        {this.state.isFormSubmitted && isTourPicked ? (
          <CarOfferList
            offers={offers}
            handleOfferPick={this.handleOfferPick}
          />
        ) : null}
        {isTourPicked && !isLoading && isOfferPicked ? (
          <TourDetails
            startDate={startDate}
            isTourPicked={isTourPicked}
            tourLabel={tourLabel}
            duration={duration}
            address={address}
            offerName={offerName}
            offerPrice={offerPrice}
            handleSubmit={this.handleSubmit}
            handleConfirmOffer={this.handleConfirmOffer}
          ></TourDetails>
        ) : null}
        <div
          ref={(el) => {
            this.messagesEnd = el;
          }}
        ></div>
      </div>
    );
  }
}

export default App;

// I know... this component got quite large.The logic could have been splitted in a better way
