import React from "react";
import "./App.css";
import { TourList } from "./components/tour-list/tour-list.component";
import { SearchBox } from "./components/search-box/search-box.component";
import { DEFAULT_TOURS_DATA } from "./assets/data/tours/default-tours.data";
import DatePicker from "react-datepicker";
import moment from "moment";

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
      duration: "200",
      type: "DURATION",
      startDate: new Date(),
      minTime: "",
    };
  }
  // handleChange = (e) => {
  //   this.setState({ searchField: e.target.value });
  // };
  handleTourPick = (id) => {
    // console.log("Trigger", id);
    // this.setState({ pickedTourId: id }, () => console.log("DATA", this.state));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originPlaceId: id,
        selectedStartDate: this.state.selectedStartDate,
        duration: this.state.duration,
        type: this.state.type,
      }),
    };
    fetch("https://www.mydriver.com/api/v5/offers", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("RESPONSE", data);
        // this.setState({ offers: data }, () =>
        //   console.log("OFFERS", this.state)
        // );
      });
    console.log();
  };
  handleDatePick = (date) => {
    this.setState(
      { startDate: date, minTime: this.calculateMinTime(date) },
      () => console.log("Datepick", this.state)
    );
  };

  calculateMinTime = (date) => {
    let isToday = moment(date).isSame(moment(), "day");
    if (isToday) {
      // Starting from the next tour
      let nowAddOneHour = moment(new Date()).add({ minutes: 30 }).toDate();
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
      { tours: DEFAULT_TOURS_DATA, minTime: this.calculateMinTime(new Date()) },
      () => console.log("DATA", this.state)
    );
    console.log("DATA", this.state.tours);
  }

  render() {
    const { tours, tourSearch, startDate } = this.state;

    return (
      <div className="App">
        <DatePicker
          // isClearable
          closeOnScroll={true}
          dateFormat="dd.MM.yyyy - HH:mm"
          placeholderText="Pick your tour date"
          selected={startDate}
          onChange={(date) => this.handleDatePick(date)}
          style={{ border: "solid 1px pink" }}
          showTimeSelect
          timeFormat="HH:mm"
          excludeOutOfBoundsTimes
          minDate={new Date()}
          minTime={this.state.minTime}
          maxTime={moment().endOf("day").toDate()} // set to 23:59 pm today
          withPortal
        />
        <input
          type="time"
          id="appt"
          name="appt"
          min="1:00"
          max="18:00"
          required
        />
        <h1>Munich Sightseeing</h1>
        <TourList tours={tours} handleTourPick={this.handleTourPick}></TourList>
      </div>
    );
  }
}

export default App;
